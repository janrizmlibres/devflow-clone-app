import { HydratedDocument, model, models, Schema, Types } from "mongoose";

import { ITag } from "./tag.model";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
  createdAt?: Date;
}

export type IQuestionDoc = HydratedDocument<
  IQuestion,
  { tags: (Types.ObjectId | HydratedDocument<ITag>)[] }
>;

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
