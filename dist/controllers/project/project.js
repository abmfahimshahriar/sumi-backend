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
exports.getUsers = exports.deleteProject = exports.updateProject = exports.getMyInvolvedProjects = exports.getMyCreatedProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../../models/project/Project"));
const dotenv_1 = __importDefault(require("dotenv"));
const inputValidator_1 = require("../../utility/validators/inputValidator");
const helperFunctions_1 = require("../helper_functions/helperFunctions");
const User_1 = __importDefault(require("../../models/auth/User"));
dotenv_1.default.config();
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectName = req.body.ProjectName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    let involvedUsers = req.body.InvolvedUsers;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const user = yield User_1.default.findById(userId).select("Email Name");
        const errorsObject = checkInputValidity(projectName, startDate, endDate);
        if (errorsObject.hasError) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: errorsObject.errors,
            });
        }
        const sameName = yield Project_1.default.find({
            ProjectName: projectName,
            CreatedBy: userId,
        });
        if (sameName.length > 0) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["A project with same name already exists for the user."],
            });
        }
        involvedUsers = filterUsers(user === null || user === void 0 ? void 0 : user._id, involvedUsers);
        const project = new Project_1.default({
            ProjectName: projectName,
            StartDate: startDate,
            EndDate: endDate,
            CreatedBy: userId,
            InvolvedUsers: [user, ...involvedUsers],
            TotalStoryPoints: 0,
            CompletedStoryPoints: 0,
        });
        const result = yield project.save();
        if (result) {
            return res.status(201).json({
                IsSuccess: true,
                Result: {
                    ProjectId: result._id,
                },
            });
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not create a project"],
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
exports.createProject = createProject;
const getMyCreatedProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = helperFunctions_1.getUserId(req);
        const myCreatedProjects = yield Project_1.default.find({ CreatedBy: userId });
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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getMyCreatedProjects = getMyCreatedProjects;
const getMyInvolvedProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = helperFunctions_1.getUserId(req);
        // const myInvolvedProjects = await Project.find({
        //   InvolvedUsers: { $eq: userId },
        //   CreatedBy: { $ne: userId },
        // });
        const myInvolvedProjects = yield Project_1.default.find({
            $or: [{ InvolvedUsers: { $elemMatch: { _id: userId } } }],
            CreatedBy: { $ne: userId },
        });
        return res.status(201).json({
            IsSuccess: true,
            Result: {
                myInvolvedProjects: myInvolvedProjects,
            },
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getMyInvolvedProjects = getMyInvolvedProjects;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const projectName = req.body.ProjectName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    let involvedUsers = req.body.InvolvedUsers;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const user = yield User_1.default.findById(userId).select("Email Name");
        const selectedProject = yield Project_1.default.findById(projectId);
        if (!selectedProject) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such project does not exists."],
            });
        }
        else {
            if (selectedProject.CreatedBy !== userId) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not update the project"],
                });
            }
            involvedUsers = filterUsers(user === null || user === void 0 ? void 0 : user._id, involvedUsers);
            selectedProject.ProjectName = projectName;
            selectedProject.StartDate = startDate;
            selectedProject.EndDate = endDate;
            selectedProject.InvolvedUsers = [user, ...involvedUsers];
            const result = yield selectedProject.save();
            if (result) {
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        ProjectId: result._id,
                    },
                });
            }
            else {
                return res.status(422).json({
                    IsSuccess: false,
                    Errors: ["Could not update the project"],
                });
            }
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const selectedProject = yield Project_1.default.findById(projectId);
        if (!selectedProject) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such project does not exists."],
            });
        }
        else {
            if (selectedProject.CreatedBy !== userId) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not delete this project"],
                });
            }
            const result = yield Project_1.default.findByIdAndRemove(projectId);
            if (result) {
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        ProjectId: result._id,
                    },
                });
            }
            else {
                return res.status(422).json({
                    IsSuccess: false,
                    Errors: ["Could not delete the project"],
                });
            }
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.deleteProject = deleteProject;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const searchText = req.body.SearchText;
    try {
        if (searchText.length === 0) {
            return res.status(201).json({
                IsSuccess: true,
                Result: {
                    Users: [],
                },
            });
        }
        let users;
        let regex = new RegExp(searchText, "i");
        users = yield User_1.default.find({
            $and: [{ $or: [{ Email: regex }, { Name: regex }] }],
        }).select("Email Name");
        return res.status(201).json({
            IsSuccess: true,
            Result: {
                Users: users,
            },
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getUsers = getUsers;
const filterUsers = (filterUserId, usersArray) => {
    const filteredUser = usersArray.filter(item => item._id != filterUserId);
    return filteredUser;
};
const checkInputValidity = (projecName, startDate, endDate) => {
    const inputs = [
        {
            fieldValue: projecName,
            fieldName: "project name",
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
    const errorsObject = inputValidator_1.inputValidator(inputs);
    return errorsObject;
};
