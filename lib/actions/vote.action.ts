"use server";

import mongoose, { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import ROUTES from "@/constants/routes";
import { Answer, Question, Vote } from "@/database";
import { IVoteDoc } from "@/database/vote.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const Model = targetType === "Question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session }
    );

    if (!result)
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote: IVoteDoc = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If the user is trying to vote the same type again, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        // If the user is changing their vote, update it
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { session }
        );

        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: existingVote.voteType,
            change: -1,
          },
          session
        );

        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        { session }
      );

      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }

    const Model = targetType === "Question" ? Question : Answer;

    const contentDoc = await Model.findById(targetId).session(session);
    if (!contentDoc) throw new NotFoundError("Content");

    const contentAuthorId = contentDoc.author.toString();

    await session.commitTransaction();

    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: contentAuthorId,
      });
    });

    revalidatePath(ROUTES.QUESTION(targetId));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote)
      return {
        success: false,
        data: { hasUpvoted: false, hasDownvoted: false },
      };

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
