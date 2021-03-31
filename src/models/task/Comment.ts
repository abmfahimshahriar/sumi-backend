import mongoose from "mongoose";
import { IAssignee } from "./Task";


export interface IComment extends mongoose.Document {
  ProjectId: string;
  SprintId: string;
  TaskId: string;
  CommentContent: string;
  Commenter: IAssignee;
  CommentedAt: Date;
}

export const CommentSchema = new mongoose.Schema({
  ProjectId: { type: String, required: true },
  SprintId: { type: String, required: true },
  TaskId: { type: String, required: true },
  CommentContent: { type: String, required: true },
  CommentedAt: { type: Date, required: true },
  Commenter: {
    type: {
      Email: { type: String, required: true },
      Name: { type: String, required: true },
    },
    required: true,
  },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
