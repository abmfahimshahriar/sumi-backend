import { Request, Response, NextFunction } from "express";
import User from "../../models/auth/User";
import { getUserId } from "../helper_functions/helperFunctions";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userName = req.body.Name;
  const userEmail = req.body.Email;
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId);
    const imageUrl = req.file.path;
    let uploadedImageUrl = "";
    let uploadImageId = "";

    if (user) {
      if (user.ProfileImageId) {
        cloudinary.v2.uploader.destroy(
          user.ProfileImageId,
          function (error, result) {
            console.log("image deleted");
            console.log(result, error);
          }
        );
      }

      await cloudinary.v2.uploader.upload(
        imageUrl,
        { tags: "profile_picture" },
        function (err, image) {
          if (err) {
            console.log(err);
          }
          if (image) {
            console.log("image uploaded");
            uploadedImageUrl = image.url;
            uploadImageId = image.public_id;
          }
        }
      );
      clearImage(imageUrl);
      user.Name = userName;
      user.Email = userEmail;
      user.ProfileImageUrl = uploadedImageUrl;
      user.ProfileImageId = uploadImageId;

      const result = await user.save();

      if (result) {
        return res.status(201).json({
          IsSuccess: true,
          Result: {
            UserId: result._id,
          },
        });
      } else {
        return res.status(422).json({
          IsSuccess: false,
          Errors: ["Could not update the user"],
        });
      }
    } else {
      return res.status(422).json({
        IsSuccess: false,
        Errors: ["User does not exist"],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "../../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
