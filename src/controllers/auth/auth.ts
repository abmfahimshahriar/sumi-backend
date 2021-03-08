import express, {Request, Response, NextFunction} from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/auth/User";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userExists = await User.findOne({ Email: email});

        if(!userExists) {
            const hashedPw = await bcryptjs.hash(password, parseInt(process.env.PASSWORD_SALT as string));
            const user = new User({
                Name: '',
                Email: email,
                Password: hashedPw
            });
            const result = await user.save();

            if(result) {
                const token = jsonwebtoken.sign({
                    UserId: result._id.toString(),
                }, process.env.TOKEN_KEY as string , {
                    expiresIn: process.env.TOKEN_KEY_EXPIRATION as string
                });

                res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        UserId: result._id,
                        Token: token,
                    }
                });
            }
            else {
                res.status(201).json({
                    IsSuccess: false,
                    Errors: [
                        "Could not create a user"
                    ]
                });
            }
        }
        else {
            res.status(422).json({
                IsSuccess: false,
                Errors: [
                    "User already exists."
                ]
            });
        }
    }
    catch(err) {
        console.log(err);
    }
};