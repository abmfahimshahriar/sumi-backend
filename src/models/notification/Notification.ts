import mongoose from "mongoose";


export interface INotification extends mongoose.Document {
  ProjectId: string;
  SprintId: string;
  TaskId: string;
  TaskName: string;
  SenderId: string;
  SenderName: string;
  ReceiverId: string;
  ReceiverName: string;
  Action: string;
  CreatedAt: Date;
  UnreadStatus: boolean;
}

export const NotificationSchema = new mongoose.Schema({
  ProjectId: { type: String, required: true },
  SprintId: { type: String, required: true },
  TaskId: { type: String, required: true },
  TaskName: { type: String, required: true },
  SenderId: { type: String, required: true },
  SenderName: { type: String, required: true },
  ReceiverId: { type: String, required: true },
  ReceiverName: { type: String, required: true },
  Action: { type: String, required: true },
  CreatedAt: { type: Date, required: true },
  UnreadStatus: { type: Boolean, required: true },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
