"use server";

import escapeRegex from "escape-string-regexp";
import mongoose, { FilterQuery, HydratedDocument, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { cache } from "react";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { Answer, Collection, Interaction, Vote } from "@/database";
import Question, { IQuestion, IQuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITag } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<HydratedDocument<IQuestion>>> {
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
          name: { $regex: `^${tag}$`, $options: "i" },
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

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionTarget: "Question",
        authorId: userId!,
      });
    });

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
): Promise<ActionResponse<IQuestionDoc>> {
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
    const question: IQuestionDoc =
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
          name: { $regex: `^${tag}$`, $options: "i" },
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

export const getQuestion = cache(
  async (params: GetQuestionParams): Promise<ActionResponse<Question>> => {
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
      const question = await Question.findById(questionId)
        .populate("tags")
        .populate("author", "_id name image");

      if (!question) {
        throw new NotFoundError("Question not found.");
      }

      after(async () => {
        await createInteraction({
          action: "view",
          actionId: questionId,
          actionTarget: "Question",
          authorId: question.author.toString(),
        });
      });

      return {
        success: true,
        data: JSON.parse(JSON.stringify(question.toObject())),
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }
);

export async function getRecommendedQuestions({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) {
  // Get user's recent interactions
  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "Question",
    action: { $in: ["view", "upvote", "bookmark", "post"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map((i) => i.actionId);

  // Get tags from interacted questions
  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds },
  }).select("tags");

  // Get unique tags
  const allTags = interactedQuestions.flatMap((q) =>
    q.tags.map((tag: Types.ObjectId) => tag.toString())
  );

  // Remove duplicates
  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: FilterQuery<typeof Question> = {
    // exclude interacted questions
    _id: { $nin: interactedQuestionIds },
    // exclude the user's own questions
    author: { $ne: new Types.ObjectId(userId) },
    // include questions with any of the unique tags
    tags: { $in: uniqueTagIds.map((id: string) => new Types.ObjectId(id)) },
  };

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: escapeRegex(query), $options: "i" } },
      { content: { $regex: escapeRegex(query), $options: "i" } },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1 }) // prioritizing engagement
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext: total > skip + questions.length,
  };
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Question> = {};
  let sortCriteria = {};

  try {
    if (filter === "recommended") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return { success: true, data: { questions: [], isNext: false } };
      }

      const recommended = await getRecommendedQuestions({
        userId,
        query,
        skip,
        limit,
      });

      return { success: true, data: recommended };
    }

    if (query) {
      filterQuery.$or = [
        { title: { $regex: escapeRegex(query), $options: "i" } },
        { content: { $regex: escapeRegex(query), $options: "i" } },
      ];
    }

    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      // lean means it will convert this MongoDB document into a plain JavaScript object that
      // makes it easier to work with
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
    // We're using JSON.parse(JSON.stringify()) to ensure compatibility with Next.js server actions.
    // Because when you try to pass large paylaods through server actions, sometimes it doesn't pass
    // them properly and you get an error.
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementViews(
  params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!question) throw new NotFoundError("Question not found.");

    // Needed for the Approach #1
    // revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { views: question.views } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return { success: true, data: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question: IQuestionDoc | null = await Question.findById(questionId);

    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId) {
      throw new UnauthorizedError();
    }

    await Collection.deleteMany({ question: questionId }, { session });
    await TagQuestion.deleteMany({ question: questionId }, { session });

    await Tag.deleteMany(
      { _id: { $in: question.tags }, questions: 1 },
      { session }
    );

    await Tag.updateMany(
      { _id: { $in: question.tags } },
      { $inc: { questions: -1 } },
      { session }
    );

    const answers = await Answer.find({ question: questionId }).session(
      session
    );

    await Vote.deleteMany(
      {
        $or: [
          { actionId: questionId, actionType: "Question" },
          {
            actionId: { $in: answers.map((answer) => answer._id) },
            actionType: "Answer",
          },
        ],
      },
      { session }
    );

    await Answer.deleteMany({ question: questionId }, { session });

    await Question.findByIdAndDelete(questionId, { session });

    await session.commitTransaction();

    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: questionId,
        actionTarget: "Question",
        authorId: question.author.toString(),
      });
    });

    revalidatePath(ROUTES.PROFILE(userId!));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
