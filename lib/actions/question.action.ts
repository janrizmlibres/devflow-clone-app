"use server";

import mongoose, { HydratedDocument, Types } from "mongoose";

import Question, { IQuestion } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITag } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question]: HydratedDocument<IQuestion>[] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds: Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);

      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question.toObject())),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question: HydratedDocument<IQuestion> =
      await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new NotFoundError("Question not found.");
    }

    if (question.author.toString() !== userId) {
      throw new UnauthorizedError();
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter((tag) => {
      return !question.tags.some(
        (t) => (t as ITag).name.toLowerCase() === tag.toLowerCase()
      );
    });

    const tagIdsToRemove = question.tags
      .filter((tag) => {
        return !tags.some(
          (t) => t.toLowerCase() === (tag as ITag).name.toLowerCase()
        );
      })
      .map((tag) => tag._id);

    const tagQuestionDocuments = [];

    for (const tag of tagsToAdd) {
      const existingTag: HydratedDocument<ITag> = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });

      question.tags.push(existingTag._id);
    }

    await Tag.deleteMany(
      { _id: { $in: tagIdsToRemove }, questions: 1 },
      { session }
    );

    await Tag.updateMany(
      { _id: { $in: tagIdsToRemove } },
      { $inc: { questions: -1 } },
      { session }
    );

    await TagQuestion.deleteMany(
      { question: question._id, tag: { $in: tagIdsToRemove } },
      { session }
    );

    question.tags = question.tags
      .filter((tag) => !tagIdsToRemove.includes(tag._id))
      .map((tag) => tag._id);

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question.toObject())),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new NotFoundError("Question not found.");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question.toObject())),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
