"use server";

import mongoose from "mongoose";

import { REPUTATION_POINTS } from "@/constants";
import { Interaction, User } from "@/database";
import {
  CreateInteractionParams,
  UpdateReputationParams,
} from "@/types/module";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params;
  const { action, actionType } = interaction;

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      {
        $inc: {
          reputation: REPUTATION_POINTS[`${action}_${actionType}`].performer,
        },
      },
      { session }
    );
    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: {
            $inc: {
              reputation:
                REPUTATION_POINTS[`${action}_${actionType}`].performer,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: {
            $inc: {
              reputation: REPUTATION_POINTS[`${action}_${actionType}`].author,
            },
          },
        },
      },
    ],
    { session }
  );
}

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    action: actionCategory,
    actionId,
    actionTarget,
    authorId,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionCategory,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session }
    );

    // Update reputation for both the performer and the content author
    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
