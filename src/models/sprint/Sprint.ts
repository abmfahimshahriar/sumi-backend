import mongoose from "mongoose";

export interface ITaskBucket {
  _id?: string;
  TaskBucketId: string;
  TaskBucketName: string;
}

export interface ISprint extends mongoose.Document {
  ProjectId: string;
  SprintName: string;
  StartDate: Date;
  EndDate: Date;
  CreatedBy: string;
  TotalStoryPoints: number;
  CompletedStoryPoints: number;
  TaskBuckets: ITaskBucket[];
  StartBucket: string;
  EndBucket: string;
}

export const SprintSchema = new mongoose.Schema({
  ProjectId: { type: String, required: true },
  SprintName: { type: String, required: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  CreatedBy: { type: String, required: true },
  TotalStoryPoints: { type: Number, required: true },
  CompletedStoryPoints: { type: Number, required: true },
  TaskBuckets: {
    type: [
      {
        TaskBucketId: { type: String, required: true },
        TaskBucketName: { type: String, required: true },
      },
    ],
    required: true,
  },
  StartBucket: { type: String, required: true },
  EndBucket: { type: String, required: true },
});

const Sprint = mongoose.model<ISprint>("Sprint", SprintSchema);
export default Sprint;
