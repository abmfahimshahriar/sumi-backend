"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/auth/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const inputValidator_1 = require("../../utility/validators/inputValidator");
dotenv_1.default.config();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.Name;
    const email = req.body.Email;
    const password = req.body.Password;
    try {
        const userExists = yield User_1.default.findOne({ Email: email });
        if (!userExists) {
            const errorsObject = checkInputValidity(name, email, password);
            if (errorsObject.hasError) {
                return res.status(422).json({
                    IsSuccess: false,
                    Errors: errorsObject.errors,
                });
            }
            const hashedPw = yield bcryptjs_1.default.hash(password, parseInt(process.env.PASSWORD_SALT));
            const user = new User_1.default({
                Name: name,
                Email: email,
                Password: hashedPw,
                ProjectsCreated: [],
                ProjectsInvolved: [],
            });
            const result = yield user.save();
            if (result) {
                const token = jsonwebtoken_1.default.sign({
                    UserId: result._id.toString(),
                }, process.env.TOKEN_KEY, {
                    expiresIn: process.env.TOKEN_KEY_EXPIRATION,
                });
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        Username: result.Name,
                        UserId: result._id,
                        Token: token,
                    },
                });
            }
            else {
                return res.status(201).json({
                    IsSuccess: false,
                    Errors: ["Could not create a user"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["User already exists."],
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.Email;
    const password = req.body.Password;
    let loggedInUser;
    let isEqualPassword;
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
        const errorsObject = inputValidator_1.inputValidator(inputs);
        if (errorsObject.hasError) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: errorsObject.errors,
            });
        }
        const user = yield User_1.default.findOne({ Email: email });
        if (!user) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["There is no such user with this email"],
            });
        }
        else {
            loggedInUser = user;
            isEqualPassword = yield bcryptjs_1.default.compare(password, loggedInUser.Password);
            if (!isEqualPassword) {
                return res.status(422).json({
                    IsSuccess: false,
                    Errors: ["Password did not match"],
                });
            }
            const token = jsonwebtoken_1.default.sign({
                UserId: loggedInUser._id.toString(),
            }, process.env.TOKEN_KEY, {
                expiresIn: process.env.TOKEN_KEY_EXPIRATION,
            });
            return res.status(200).json({
                IsSuccess: true,
                Result: {
                    Username: loggedInUser.Name,
                    UserId: loggedInUser._id,
                    Token: token,
                },
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.login = login;
const checkInputValidity = (name, email, password) => {
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
    const errorsObject = inputValidator_1.inputValidator(inputs);
    return errorsObject;
};
