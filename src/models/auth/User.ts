import mongoose from "mongoose";
import {
  USER_EMAIL_MAX,
  USER_NAME_MAX,
  USER_NAME_MIN,
} from "../../utility/constants/formValidationConstants";

export interface IUser extends mongoose.Document {
  Name: string;
  Email: string;
  Password: string;
  ProjectsCreated: string[];
  ProjectsInvolved: string[];
  ProfileImageUrl: string;
  ProfileImageId: string;
}

export const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name required"],
    minLength: [USER_NAME_MIN, `Minimum length ${USER_NAME_MIN}`],
    maxLength: [USER_NAME_MAX, `Maximum length ${USER_NAME_MAX}`],
  },
  Email: {
    type: String,
    required: [true, "Email required"],
    minLength: [USER_NAME_MIN, `Minimum length ${USER_NAME_MIN}`],
    maxLength: [USER_EMAIL_MAX, `Maximum length ${USER_EMAIL_MAX}`],
  },
  Password: { type: String, required: [true, "Password required"] },
  ProjectsCreated: { type: [String], required: true },
  ProjectsInvolved: { type: [String], required: true },
  ProfileImageUrl: { type: String, required: true },
  ProfileImageId: { type: String, required: false },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
