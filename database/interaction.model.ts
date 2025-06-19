import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export const InteractionActionEnums = [
  "post",
  "upvote",
  "downvote",
  "delete",
  "view",
  "bookmark",
] as const;

export interface IInteraction {
  user: Types.ObjectId;
  action: (typeof InteractionActionEnums)[number];
  actionId: Types.ObjectId;
  actionType: "Question" | "Answer";
}

export type IInteractionDoc = HydratedDocument<IInteraction>;

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: InteractionActionEnums,
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
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
