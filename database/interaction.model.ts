import { model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;
  action: "question" | "answer" | "upvote" | "downvote" | "view";
  actionId: Types.ObjectId;
  actionType: "Question" | "Answer";
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["question", "answer", "upvote", "downvote", "view"],
      required: true,
    },
    actionId: {
      type: Schema.Types.ObjectId,
      refPath: "actionType",
      required: true,
    },
    actionType: {
      type: String,
      enum: ["Question", "Answer"],
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
