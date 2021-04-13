import { ITask } from "./../../models/task/Task";
import { ISprint } from "./../../models/sprint/Sprint";
import { IProject } from "./../../models/project/Project";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/auth/User";
import Notification from "../../models/notification/Notification";
import { getUserId } from "../helper_functions/helperFunctions";

export const createNotification = async (
  senderId: string,
  receiverId: string,
  project: IProject,
  sprint: ISprint,
  task: ITask,
  action: string,
  next: NextFunction
) => {
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender && receiver) {
      const notification = new Notification({
        ProjectId: project._id,
        SprintId: sprint._id,
        TaskId: task._id,
        TaskName: task.TaskName,
        SenderId: sender._id,
        SenderName: sender.Name,
        ReceiverId: receiver._id,
        ReceiverName: receiver.Name,
        Action: action,
        CreatedAt: new Date().toISOString(),
        UnreadStatus: true,
      });

      const result = await notification.save();
      if (result) return true;
      else return false;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageNumber = req.params.pageNumber;
  try {
    const userId = getUserId(req);
    const notificationLimit = 5;
    const showNotificationNumber = notificationLimit * +pageNumber;

    const notifications = await Notification.find({ ReceiverId: userId })
      .limit(showNotificationNumber)
      .sort({ CreatedAt: -1 });

    return res.status(200).json({
      IsSuccess: true,
      Result: {
        Notifications: notifications,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const readNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const notificationId = req.body.NotificationId;
  try {
    const userId = getUserId(req);

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Such notification does not exist."],
      });
    }

    if (notification.ReceiverId != userId) {
      return res.status(401).json({
        IsSuccess: false,
        Errors: ["You are unauthorized for this operation"],
      });
    }

    notification.UnreadStatus = false;

    const result = await notification.save();

    if (result) {
      return res.status(200).json({
        IsSuccess: true,
        Result: {
          Notification: result,
        },
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
