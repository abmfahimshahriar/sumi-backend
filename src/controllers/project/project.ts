import { Request, Response, NextFunction } from "express";
import Project from "../../models/project/Project";
import dotenv from "dotenv";
import { inputValidator } from "../../utility/validators/inputValidator";
import { getUserId } from "./helper_functions/helperFunctions";

dotenv.config();

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectName = req.body.ProjectName;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const involvedUsers = req.body.InvolvedUsers;
  try {
    const userId = getUserId(req);

    const errorsObject = checkInputValidity(projectName, startDate, endDate);
    if (errorsObject.hasError) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: errorsObject.errors,
      });
    }
    const sameName = await Project.find({
      ProjectName: projectName,
      CreatedBy: userId,
    });
    if (sameName.length > 0) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["A project with same name already exists for the user."],
      });
    }
    const project = new Project({
      ProjectName: projectName,
      StartDate: startDate,
      EndDate: endDate,
      CreatedBy: userId,
      InvolvedUsers: [userId, ...involvedUsers],
      TotalStoryPoints: 0,
      CompletedStoryPoints: 0,
    });

    const result = await project.save();

    if (result) {
      return res.status(201).json({
        IsSuccess: true,
        Result: {
          ProjectId: result._id,
        },
      });
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Could not create a project"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getMyCreatedProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);

    const myCreatedProjects = await Project.find({ CreatedBy: userId });
    const res2 = await Project.find({
      InvolvedUsers: { $eq: userId },
      CreatedBy: { $ne: userId },
    });

    if (myCreatedProjects.length > 0) {
      return res.status(201).json({
        IsSuccess: true,
        Result: {
          myCreatedProjects: myCreatedProjects,
        },
      });
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["You currently do not have any created projects"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getMyInvolvedProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);

    const myInvolvedProjects = await Project.find({
      InvolvedUsers: { $eq: userId },
      CreatedBy: { $ne: userId },
    });

    if (myInvolvedProjects.length > 0) {
      return res.status(201).json({
        IsSuccess: true,
        Result: {
          myInvolvedProjects: myInvolvedProjects,
        },
      });
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["You are currently not involved in any other projects"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.projectId;
  const projectName = req.body.ProjectName;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const involvedUsers = req.body.InvolvedUsers;
  try {
    const userId = getUserId(req);

    const selectedProject = await Project.findById(projectId);
    if (!selectedProject) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["Such project does not exists."],
      });
    } else {
      if (selectedProject.CreatedBy !== userId) {
        return res.status(401).json({
          IsSuccess: false,
          Errors: ["You can not update the project"],
        });
      }
      selectedProject.ProjectName = projectName;
      selectedProject.StartDate = startDate;
      selectedProject.EndDate = endDate;
      selectedProject.InvolvedUsers = [userId, ...involvedUsers];

      const result = await selectedProject.save();

      if (result) {
        return res.status(201).json({
          IsSuccess: true,
          Result: {
            ProjectId: result._id,
          },
        });
      } else {
        return res.status(422).json({
          IsSuccess: false,
          Errors: ["Could not update the project"],
        });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const checkInputValidity = (
  projecName: string,
  startDate: Date,
  endDate: Date
) => {
  const inputs = [
    {
      fieldValue: projecName,
      fieldName: "projec name",
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
