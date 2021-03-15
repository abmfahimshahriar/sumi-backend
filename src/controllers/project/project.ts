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
  const authHeader = req.get("Authorization");
  let userId = null;
  const projectName = req.body.ProjectName;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const involvedUsers = req.body.InvolvedUsers;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      userId = getUserId(token);
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["User is not authenticated"],
      });
    }

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
    if (sameName) {
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
      return res.status(201).json({
        IsSuccess: false,
        Errors: ["Could not create a user"],
      });
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
