"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Answer, Question } from "@/database";
import { IAnswerDoc } from "@/database/answer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { AnswerServerSchema } from "../validations";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { answers: 1 } },
      { session, new: true }
    );

    if (!question) throw new NotFoundError("Question");

    const [answer] = await Answer.create(
      [{ author: userId, question: questionId, content }],
      { session }
    );

    if (!answer) throw new NotFoundError("Answer");

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
