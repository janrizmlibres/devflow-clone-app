"use server";

import mongoose from "mongoose";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";

export async function createQuestion(
  params: QuestionContent
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tagIds = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOne({ name: tag }).session(session);

      if (existingTag) {
        existingTag.questions += 1;
        await existingTag.save({ session });
        tagIds.push(existingTag._id);
      } else {
        const [newTag] = await Tag.create([{ name: tag, questions: 1 }], {
          session,
        });
        tagIds.push(newTag._id);
      }
    }

    const userId = validationResult.session!.user!.id;

    const [question] = await Question.create(
      [
        {
          title,
          content,
          tags: tagIds,
          author: userId,
        },
      ],
      { session }
    );

    for (const tagId of tagIds) {
      await TagQuestion.create(
        [
          {
            tagId,
            questionId: question._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
