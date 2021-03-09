import { IUser } from "./../../models/auth/User";
import express, { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/auth/User";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.Email;
  const password = req.body.Password;

  try {
    const userExists = await User.findOne({ Email: email });

    if (!userExists) {
      const hashedPw = await bcryptjs.hash(
        password,
        parseInt(process.env.PASSWORD_SALT as string)
      );
      const user = new User({
        Name: "",
        Email: email,
        Password: hashedPw,
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
    console.log(err);
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
          UserId: loggedInUser._id,
          Token: token,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
