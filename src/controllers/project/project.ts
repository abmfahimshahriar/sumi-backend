import { ENTITY_TITLE_MAX, ENTITY_START_DATE, ENTITY_END_DATE, ENTITY_TITLE_MIN, ENTITY_START_DATE_MIN, ENTITY_END_DATE_MIN } from './../../utility/constants/formValidationConstants';
import { Request, Response, NextFunction } from "express";
import Project, { IInvolvedUser } from "../../models/project/Project";
import dotenv from "dotenv";
import { inputValidator } from "../../utility/validators/inputValidator";
import { getUserId } from "../helper_functions/helperFunctions";
import User from "../../models/auth/User";

dotenv.config();

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectName = req.body.ProjectName;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  let involvedUsers = req.body.InvolvedUsers;
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId).select("Email Name");

    // const errorsObject = checkInputValidity(projectName, startDate, endDate);
    // if (errorsObject.hasError) {
    //   return res.status(422).json({
    //     IsSuccess: false,
    //     Errors: errorsObject.errors,
    //   });
    // }
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
    involvedUsers = filterUsers(user?._id, involvedUsers);
    const project = new Project({
      ProjectName: projectName,
      StartDate: startDate,
      EndDate: endDate,
      CreatedBy: userId,
      InvolvedUsers: [user, ...involvedUsers],
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
    // const res2 = await Project.find({
    //   InvolvedUsers: { $eq: userId },
    //   CreatedBy: { $ne: userId },
    // });

    return res.status(201).json({
      IsSuccess: true,
      Result: {
        myCreatedProjects: myCreatedProjects,
      },
    });
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

    // const myInvolvedProjects = await Project.find({
    //   InvolvedUsers: { $eq: userId },
    //   CreatedBy: { $ne: userId },
    // });

    const myInvolvedProjects = await Project.find({
      $or: [{ InvolvedUsers: { $elemMatch: { _id: userId } } }],
      CreatedBy: { $ne: userId },
    });

    return res.status(201).json({
      IsSuccess: true,
      Result: {
        myInvolvedProjects: myInvolvedProjects,
      },
    });
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
  let involvedUsers = req.body.InvolvedUsers;
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId).select("Email Name");

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
      involvedUsers = filterUsers(user?._id, involvedUsers);
      selectedProject.ProjectName = projectName;
      selectedProject.StartDate = startDate;
      selectedProject.EndDate = endDate;
      selectedProject.InvolvedUsers = [user, ...involvedUsers];

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

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.projectId;

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
          Errors: ["You can not delete this project"],
        });
      }

      const result = await Project.findByIdAndRemove(projectId);

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
          Errors: ["Could not delete the project"],
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

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchText = req.body.SearchText;

  try {
    if(searchText.length === 0) {
      return res.status(201).json({
        IsSuccess: true,
        Result: {
          Users: [],
        },
      });
    }
    let users;

    let regex = new RegExp(searchText, "i");
    users = await User.find({
      $and: [{ $or: [{ Email: regex }, { Name: regex }] }],
    }).select("Email Name");
    return res.status(201).json({
      IsSuccess: true,
      Result: {
        Users: users,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const filterUsers = (filterUserId: string, usersArray: IInvolvedUser[]) => {
  const filteredUser =  usersArray.filter(item => item._id != filterUserId);
  return filteredUser;
}

const checkInputValidity = (
  projecName: string,
  startDate: Date,
  endDate: Date
) => {
  const inputs = [
    {
      fieldValue: projecName,
      fieldName: "project name",
      validations: ["required"],
      minLength: ENTITY_TITLE_MIN,
      maxLength: ENTITY_TITLE_MAX,
    },
    {
      fieldValue: startDate,
      fieldName: "start date",
      validations: ["required"],
      minLength: ENTITY_START_DATE_MIN,
      maxLength: ENTITY_START_DATE,
    },
    {
      fieldValue: endDate,
      fieldName: "end date",
      validations: ["required"],
      minLength: ENTITY_END_DATE_MIN,
      maxLength: ENTITY_END_DATE,
    },
  ];

  const errorsObject = inputValidator(inputs);
  return errorsObject;
};
