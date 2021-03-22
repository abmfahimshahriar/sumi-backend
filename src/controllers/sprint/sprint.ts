import { Request, Response, NextFunction } from "express";
import Sprint, { ITaskBucket } from "../../models/sprint/Sprint";
import dotenv from "dotenv";
import { inputValidator } from "../../utility/validators/inputValidator";
import { getUserId } from "../helper_functions/helperFunctions";
import User from "../../models/auth/User";
import Project from "../../models/project/Project";

dotenv.config();

export const createSprint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.body.ProjectId;
  const sprintName = req.body.SprintName;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  let taskBuckets = req.body.TaskBuckets;
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId).select("Email Name");

    const errorsObject = checkInputValidity(
      projectId,
      sprintName,
      startDate,
      endDate
    );
    if (errorsObject.hasError) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: errorsObject.errors,
      });
    }

    const project = await Project.findById(projectId);
    if (userId !== project?.CreatedBy) {
      return res.status(401).json({
        IsSuccess: false,
        Errors: ["You can not create a sprint under this project"],
      });
    }

    const sameName = await Sprint.find({
      SprintName: sprintName,
      CreatedBy: userId,
    });
    if (sameName.length > 0) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["A sprint with same name already exists for the user."],
      });
    }

    const sprint = new Sprint({
      ProjectId: projectId,
      SprintName: sprintName,
      StartDate: startDate,
      EndDate: endDate,
      CreatedBy: userId,
      TotalStoryPoints: 0,
      CompletedStoryPoints: 0,
      TaskBuckets: [...taskBuckets],
    });

    const result = await sprint.save();

    if (result) {
      return res.status(201).json({
        IsSuccess: true,
        Result: {
          SprintId: result._id,
        },
      });
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Could not create a sprint"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getSprints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.projectId;
  try {
    const userId = getUserId(req);
    const project = await Project.findById(projectId);
    if (project) {
      const involvedUsers = project.InvolvedUsers;
      const userInInvolvedUser = involvedUsers.find(
        (item) => item._id == userId
      );
      if (!userInInvolvedUser) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: ["You dont have access to this project's sprints"],
        });
      }
    } else {
      return res.status(404).json({
        IsSuccess: false,
        Errors: ["Could not find the project"],
      });
    }
    const sprints = await Sprint.find({ ProjectId: projectId });

    return res.status(201).json({
      IsSuccess: true,
      Result: {
        Sprints: sprints,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
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
