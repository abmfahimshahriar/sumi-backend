import mongoose from "mongoose";

export interface ITaskBucket {
    _id?: string;
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
  };
  
  export const SprintSchema = new mongoose.Schema({
    ProjectId: {type: String, required: true},
    SprintName: {type: String, required: true},
    StartDate: {type: Date, required: true},
    EndDate: {type: Date, required: true},
    CreatedBy: {type: String, required: true},
    TotalStoryPoints: {type: Number, required: true},
    CompletedStoryPoints: {type: Number, required: true},
    TaskBuckets: {type: [{
        TaskBucketName: {type: String, required: true},
      }], required: true},
  });
  
  const Sprint = mongoose.model<ISprint>('Sprint', SprintSchema);
  export default Sprint;