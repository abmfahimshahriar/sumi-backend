import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(422).json({
      IsSuccess: false,
      Errors: ["Couldn't find authentication header"],
    });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_KEY as string);
  } catch (err) {
    return res.status(422).json({
      IsSuccess: false,
      Errors: ["Couldn't verify token"],
    });
  }
  if (!decodedToken) {
    return res.status(422).json({
      IsSuccess: false,
      Errors: ["User is not authenticated"],
    });
  } else {
    next();
  }
};
