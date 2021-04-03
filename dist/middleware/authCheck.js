"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authCheck = (req, res, next) => {
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
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
    }
    catch (err) {
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
    }
    else {
        next();
    }
};
exports.authCheck = authCheck;
