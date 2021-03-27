import mongoose from "mongoose";

export interface IAssignee {
  _id?: string;
  Name: string;
  Email: string;
}

export interface ITask extends mongoose.Document {
  ProjectId: string;
  SprintId: string;
  TaskName: string;
  TaskDescription: string;
  StartDate: Date;
  EndDate: Date;
  CreatedBy: string;
  StoryPoints: number;
  CurrentBucket: string;
  Assignee: IAssignee;
  IsDone: boolean;
}

export const TaskSchema = new mongoose.Schema({
  ProjectId: { type: String, required: true },
  SprintId: { type: String, required: true },
  TaskName: { type: String, required: true },
  TaskDescription: { type: String, required: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  CreatedBy: { type: String, required: true },
  StoryPoints: { type: Number, required: true },
  CurrentBucket: { type: String, required: true },
  Assignee: {
    type: {
      Email: { type: String, required: true },
      Name: { type: String, required: true },
    },
    required: true,
  },
  IsDone: { type: Boolean, required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
