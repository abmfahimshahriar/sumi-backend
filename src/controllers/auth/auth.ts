import { IUser } from "./../../models/auth/User";
import express, { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/auth/User";
import dotenv from "dotenv";
import { inputValidator } from "../../utility/validators/inputValidator";
import { USER_DEFAULT_PROFILE_IMAGE_URL } from "../../utility/constants/userConstants";

dotenv.config();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.Name;
  const email = req.body.Email;
  const password = req.body.Password;

  try {
    const userExists = await User.findOne({ Email: email });

    if (!userExists) {
      const errorsObject = checkInputValidity(name, email, password);
      if (errorsObject.hasError) {
        return res.status(422).json({
          IsSuccess: false,
          Errors: errorsObject.errors,
        });
      }
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      );
      const user = new User({
        Name: name,
        Email: email,
        Password: hashedPw,
        ProjectsCreated: [],
        ProjectsInvolved: [],
        ProfileImageUrl: USER_DEFAULT_PROFILE_IMAGE_URL,
      });
      const result = await user.save();

      if (result) {
        const token = jsonwebtoken.sign(
          {
            UserId: result._id.toString(),
          },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
          }
        );

        return res.status(201).json({
          IsSuccess: true,
          Result: {
            Username: result.Name,
            UserId: result._id,
            Token: token,
          },
        });
      } else {
        return res.status(201).json({
          IsSuccess: false,
          Errors: ["Could not create a user"],
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["User already exists."],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.Email;
  const password = req.body.Password;

  let loggedInUser: IUser;
  let isEqualPassword: boolean;
  try {
    const inputs = [
      {
        fieldValue: email,
        fieldName: "email",
        validations: ["required"],
        minLength: 8,
        maxLength: 20,
      },
      {
        fieldValue: password,
        fieldName: "password",
        validations: ["required"],
        minLength: 4,
        maxLength: 10,
      },
    ];
    const errorsObject = inputValidator(inputs);
    if (errorsObject.hasError) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: errorsObject.errors,
      });
    }

    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["There is no such user with this email"],
      });
    } else {
      loggedInUser = user;
      isEqualPassword = await bcryptjs.compare(password, loggedInUser.Password);

      if (!isEqualPassword) {
        return res.status(422).json({
          IsSuccess: false,
          Errors: ["Password did not match"],
        });
      }

      const token = jsonwebtoken.sign(
        {
          UserId: loggedInUser._id.toString(),
        },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_KEY_EXPIRATION as string,
        }
      );

      return res.status(200).json({
        IsSuccess: true,
        Result: {
          Username: loggedInUser.Name,
          UserId: loggedInUser._id,
          Token: token,
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

const checkInputValidity = (name:string, email: string, password: Date) => {
  const inputs = [
    {
      fieldValue: name,
      fieldName: "name",
      validations: ["required"],
      minLength: 8,
      maxLength: 20,
    },
    {
      fieldValue: email,
      fieldName: "email",
      validations: ["required"],
      minLength: 8,
      maxLength: 20,
    },
    {
      fieldValue: password,
      fieldName: "password",
      validations: ["required", "minLength", "maxLength"],
      minLength: 4,
      maxLength: 10,
    },
  ];

  const errorsObject = inputValidator(inputs);
  return errorsObject;
};
