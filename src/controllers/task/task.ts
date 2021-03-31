import { Request, Response, NextFunction } from "express";
import Sprint, { ITaskBucket } from "../../models/sprint/Sprint";
import dotenv from "dotenv";
import { inputValidator } from "../../utility/validators/inputValidator";
import { getUserId } from "../helper_functions/helperFunctions";
import User from "../../models/auth/User";
import Project from "../../models/project/Project";
import Task from "../../models/task/Task";
import {
  updateProjectTotalStoryPoints,
  updateSprintTotalStoryPoints,
} from "../helper_functions/updateStoryPoints";

dotenv.config();

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.body.ProjectId;
  const sprintId = req.body.SprintId;
  const taskName = req.body.TaskName;
  const taskDescription = req.body.TaskDescription;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const storyPoints = req.body.StoryPoints;
  const assignee = req.body.Assignee;

  try {
    const userId = getUserId(req);

    // const errorsObject = checkInputValidity(
    //   projectId,
    //   sprintid,
    //   taskName,
    //   sprintName,
    //   startDate,
    //   endDate
    // );
    // if (errorsObject.hasError) {
    //   return res.status(422).json({
    //     IsSuccess: false,
    //     Errors: errorsObject.errors,
    //   });
    // }

    const project = await Project.findById(projectId);
    if (project) {
      const involvedUsers = project.InvolvedUsers;
      const currentUser = involvedUsers.find((item) => item._id == userId);
      if (!currentUser) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: ["You can not create task under this project"],
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No project found"],
      });
    }
    let startBucket;
    const sprint = await Sprint.findById(sprintId);
    if (sprint) {
      startBucket = sprint.TaskBuckets.find(
        (item) => item.TaskBucketId === sprint.StartBucket
      );
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No sprint found"],
      });
    }

    const sameName = await Task.find({
      TaskName: taskName,
      CreatedBy: userId,
    });
    if (sameName.length > 0) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["A task with same name already exists for the user."],
      });
    }

    const task = new Task({
      ProjectId: projectId,
      SprintId: sprintId,
      TaskName: taskName,
      TaskDescription: taskDescription,
      StartDate: startDate,
      EndDate: endDate,
      CreatedBy: userId,
      StoryPoints: storyPoints,
      CurrentBucket: startBucket?.TaskBucketId,
      Assignee: assignee,
      IsDone: false,
    });

    const result = await task.save();

    if (result) {
      project.TotalStoryPoints = project.TotalStoryPoints + storyPoints;
      sprint.TotalStoryPoints = sprint.TotalStoryPoints + storyPoints;
      const res1 = await project.save();
      const res2 = await sprint.save();
      // const res1 = updateSprintTotalStoryPoints(sprintId);
      // const res2 = updateProjectTotalStoryPoints(projectId);
      if (res1 && res2) {
        return res.status(201).json({
          IsSuccess: true,
          Result: {
            TaskId: result._id,
          },
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Could not create a task"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.body.ProjectId;
  const sprintId = req.body.SprintId;
  const taskId = req.body.TaskId;
  const taskName = req.body.TaskName;
  const taskDescription = req.body.TaskDescription;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const storyPoints = req.body.StoryPoints;
  const assignee = req.body.Assignee;
  try {
    const userId = getUserId(req);

    // const errorsObject = checkInputValidity(
    //   projectId,
    //   sprintid,
    //   taskName,
    //   sprintName,
    //   startDate,
    //   endDate
    // );
    // if (errorsObject.hasError) {
    //   return res.status(422).json({
    //     IsSuccess: false,
    //     Errors: errorsObject.errors,
    //   });
    // }

    const project = await Project.findById(projectId);
    if (project) {
      const involvedUsers = project.InvolvedUsers;
      const currentUser = involvedUsers.find((item) => item._id == userId);
      if (!currentUser) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: ["You can not update task under this project"],
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No project found"],
      });
    }
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No sprint found"],
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Such task does not exists."],
      });
    }
    const prevStoryPoints = task.StoryPoints;
    task.TaskName = taskName;
    task.TaskDescription = taskDescription;
    task.StartDate = startDate;
    task.EndDate = endDate;
    task.StoryPoints = storyPoints;
    task.Assignee = assignee;

    const result = await task.save();

    if (result) {
      if (task.IsDone) {
        project.CompletedStoryPoints =
          project.CompletedStoryPoints + storyPoints - prevStoryPoints;
        sprint.CompletedStoryPoints =
          sprint.CompletedStoryPoints + storyPoints - prevStoryPoints;
      }
      project.TotalStoryPoints =
        project.TotalStoryPoints + storyPoints - prevStoryPoints;
      sprint.TotalStoryPoints =
        sprint.TotalStoryPoints + storyPoints - prevStoryPoints;
      const res1 = await project.save();
      const res2 = await sprint.save();
      // const res1 = updateSprintTotalStoryPoints(sprintId);
      // const res2 = updateProjectTotalStoryPoints(projectId);
      if (res1 && res2) {
        return res.status(201).json({
          IsSuccess: true,
          Result: {
            TaskId: result._id,
          },
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Could not update the task"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserId(req);

  const sprintId = req.params.sprintId;
  const sprint = await Sprint.findById(sprintId);
  if (sprint) {
    const project = await Project.findById(sprint.ProjectId);
    if (project) {
      const involvedUsers = project.InvolvedUsers;
      const currentUser = involvedUsers.find((item) => item._id == userId);
      if (!currentUser) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: ["You can not view the tasks under this project"],
        });
      }

      const tasks = await Task.find({ SprintId: sprintId });

      return res.status(200).json({
        IsSuccess: true,
        Result: {
          Sprint: sprint,
          Tasks: tasks,
        },
      });
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No project found"],
      });
    }
  } else {
    return res.status(422).json({
      IsSuccess: false,
      Errors: ["No sprint found"],
    });
  }
};

export const changeBucket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserId(req);

  const taskId = req.body.TaskId;
  const newBucket = req.body.NewBucket;
  const task = await Task.findById(taskId);
  const sprint = await Sprint.findById(task?.SprintId);
  if (sprint && task) {
    const project = await Project.findById(sprint.ProjectId);
    if (project) {
      const involvedUsers = project.InvolvedUsers;
      const currentUser = involvedUsers.find((item) => item._id == userId);
      if (!currentUser) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: [
            "You can not change the bucket of the task under this project",
          ],
        });
      }

      const selectedNewBucket = sprint.TaskBuckets.find(
        (item) => item.TaskBucketId === newBucket
      );
      if (!selectedNewBucket) {
        return res.status(422).json({
          IsSuccess: false,
          Errors: ["There is no such bucket"],
        });
      }
      if (task.IsDone) {
        task.CurrentBucket = newBucket;
        task.IsDone = false;
        const result = await task.save();
        project.CompletedStoryPoints =
          project.CompletedStoryPoints - task.StoryPoints;
        sprint.CompletedStoryPoints =
          sprint.CompletedStoryPoints - task.StoryPoints;
        const res1 = await project.save();
        const res2 = await sprint.save();
        if (result && res1 && res2) {
          return res.status(201).json({
            IsSuccess: true,
            Result: {
              Task: task,
            },
          });
        }
      } else {
        if (sprint.EndBucket === newBucket) {
          task.CurrentBucket = newBucket;
          task.IsDone = true;
          const result = await task.save();
          project.CompletedStoryPoints =
            project.CompletedStoryPoints + task.StoryPoints;
          sprint.CompletedStoryPoints =
            sprint.CompletedStoryPoints + task.StoryPoints;
          const res1 = await project.save();
          const res2 = await sprint.save();

          if (result && res1 && res2) {
            return res.status(201).json({
              IsSuccess: true,
              Result: {
                Task: task,
              },
            });
          }
        } else {
          task.CurrentBucket = newBucket;
          const result = await task.save();
          if (result) {
            return res.status(201).json({
              IsSuccess: true,
              Result: {
                Task: task,
              },
            });
          }
        }
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["No project found"],
      });
    }
  } else {
    return res.status(422).json({
      IsSuccess: false,
      Errors: ["No sprint found"],
    });
  }
};

const checkInputValidity = (
  projectId: string,
  sprintName: string,
  startDate: Date,
  endDate: Date
) => {
  const inputs = [
    {
      fieldValue: projectId,
      fieldName: "project id",
      validations: ["required"],
      minLength: 8,
      maxLength: 20,
    },
    {
      fieldValue: sprintName,
      fieldName: "sprint name",
      validations: ["required"],
      minLength: 8,
      maxLength: 20,
    },
    {
      fieldValue: startDate,
      fieldName: "start date",
      validations: ["required"],
      minLength: 4,
      maxLength: 10,
    },
    {
      fieldValue: endDate,
      fieldName: "end date",
      validations: ["required"],
      minLength: 4,
      maxLength: 10,
    },
  ];

  const errorsObject = inputValidator(inputs);
  return errorsObject;
};
