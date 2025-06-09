import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: "Question" | "Answer";
  voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, refPath: "type", required: true },
    actionType: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
