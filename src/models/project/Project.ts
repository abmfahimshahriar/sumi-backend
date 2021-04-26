import mongoose from "mongoose";
import { ENTITY_TITLE_MIN, ENTITY_TITLE_MAX } from "../../utility/constants/formValidationConstants";

export interface IInvolvedUser {
  _id?: string;
  Name: string;
  Email: string;
}

export interface IProject extends mongoose.Document {
  ProjectName: string;
  StartDate: Date;
  EndDate: Date;
  CreatedBy: string;
  InvolvedUsers: IInvolvedUser[];
  TotalStoryPoints: number;
  CompletedStoryPoints: number;
}

export const ProjectSchema = new mongoose.Schema({
  ProjectName: {
    type: String,
    required: [true, "Project name required"],
    minLength: [ENTITY_TITLE_MIN, `Minimum length ${ENTITY_TITLE_MIN}`],
    maxLength: [ENTITY_TITLE_MAX, `Maximum length ${ENTITY_TITLE_MAX}`],
  },
  StartDate: { type: Date, required: [true, "Start date required"], },
  EndDate: { type: Date, required: [true, "End date required"], },
  CreatedBy: { type: String, required: [true, "Created by required"], },
  InvolvedUsers: {
    type: [
      {
        Email: { type: String, required: [true, "Involved user email required"], },
        Name: { type: String, required: [true, "Involved user name required"], },
      },
    ],
    required: [true, "Involved user required"],
  },
  TotalStoryPoints: { type: Number, required: [true, "Total story point required"], },
  CompletedStoryPoints: { type: Number, required: [true, "Completed story point required"], },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
