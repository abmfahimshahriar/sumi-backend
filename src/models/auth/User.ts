import mongoose from "mongoose";


export interface IUser extends mongoose.Document {
    Name?: string; 
    Email: string;
    Password: string;
    ProjectsCreated: string[];
    ProjectsInvolved: string[];
  };
  
  export const UserSchema = new mongoose.Schema({
    Name: {type:String, required: false},
    Email: {type:String, required: true},
    Password: {type:String, required: true},
    ProjectsCreated: {type: [String], required: true},
    ProjectsInvolved: {type: [String], required: true},
  });
  
  const User = mongoose.model<IUser>('User', UserSchema);
  export default User;