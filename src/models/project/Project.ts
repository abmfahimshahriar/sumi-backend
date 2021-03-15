import mongoose from "mongoose";


export interface IProject extends mongoose.Document {
    ProjectName: string;
    StartDate: Date;
    EndDate: Date;
    CreatedBy: string;
    InvolvedUsers: string[];
    TotalStoryPoints: number;
    CompletedStoryPoints: number;
  };
  
  export const ProjectSchema = new mongoose.Schema({
    ProjectName: {type: String, required: true},
    StartDate: {type: Date, required: true},
    EndDate: {type: Date, required: true},
    CreatedBy: {type: String, required: true},
    InvolvedUsers: {type: [String], required: true},
    TotalStoryPoints: {type: Number, required: true},
    CompletedStoryPoints: {type: Number, required: true},
  });
  
  const Project = mongoose.model<IProject>('Project', ProjectSchema);
  export default Project;