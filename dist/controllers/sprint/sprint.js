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
exports.deleteSprint = exports.updateSprint = exports.getSprints = exports.createSprint = void 0;
const Sprint_1 = __importDefault(require("../../models/sprint/Sprint"));
const dotenv_1 = __importDefault(require("dotenv"));
const inputValidator_1 = require("../../utility/validators/inputValidator");
const helperFunctions_1 = require("../helper_functions/helperFunctions");
const User_1 = __importDefault(require("../../models/auth/User"));
const Project_1 = __importDefault(require("../../models/project/Project"));
dotenv_1.default.config();
const createSprint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintName = req.body.SprintName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    let taskBuckets = req.body.TaskBuckets;
    const startBucket = req.body.StartBucket;
    const endBucket = req.body.EndBucket;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const user = yield User_1.default.findById(userId).select("Email Name");
        const errorsObject = checkInputValidity(projectId, sprintName, startDate, endDate);
        if (errorsObject.hasError) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: errorsObject.errors,
            });
        }
        const project = yield Project_1.default.findById(projectId);
        if (userId !== (project === null || project === void 0 ? void 0 : project.CreatedBy)) {
            return res.status(401).json({
                IsSuccess: false,
                Errors: ["You can not create a sprint under this project"],
            });
        }
        const sameName = yield Sprint_1.default.find({
            SprintName: sprintName,
            CreatedBy: userId,
        });
        if (sameName.length > 0) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["A sprint with same name already exists for the user."],
            });
        }
        const sprint = new Sprint_1.default({
            ProjectId: projectId,
            SprintName: sprintName,
            StartDate: startDate,
            EndDate: endDate,
            CreatedBy: userId,
            TotalStoryPoints: 0,
            CompletedStoryPoints: 0,
            TaskBuckets: [...taskBuckets],
            StartBucket: startBucket,
            EndBucket: endBucket,
        });
        const result = yield sprint.save();
        if (result) {
            return res.status(201).json({
                IsSuccess: true,
                Result: {
                    SprintId: result._id,
                },
            });
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not create a sprint"],
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
exports.createSprint = createSprint;
const getSprints = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const userInInvolvedUser = involvedUsers.find((item) => item._id == userId);
            if (!userInInvolvedUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You dont have access to this project's sprints"],
                });
            }
        }
        else {
            return res.status(404).json({
                IsSuccess: false,
                Errors: ["Could not find the project"],
            });
        }
        const sprints = yield Sprint_1.default.find({ ProjectId: projectId });
        return res.status(200).json({
            IsSuccess: true,
            Result: {
                Sprints: sprints,
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
exports.getSprints = getSprints;
const updateSprint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const sprintName = req.body.SprintName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    const taskBuckets = req.body.TaskBuckets;
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
                    Errors: ["You can not update the sprint"],
                });
            }
        }
        const selectedSprint = yield Sprint_1.default.findById(sprintId);
        if (!selectedSprint) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such sprint does not exists."],
            });
        }
        selectedSprint.SprintName = sprintName;
        selectedSprint.StartDate = startDate;
        selectedSprint.EndDate = endDate;
        selectedSprint.TaskBuckets = [
            ...selectedSprint.TaskBuckets,
            ...taskBuckets,
        ];
        const result = yield selectedSprint.save();
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
                Errors: ["Could not update the sprint"],
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
exports.updateSprint = updateSprint;
const deleteSprint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
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
                    Errors: ["You can not delete this sprint"],
                });
            }
            const selectedSprint = yield Sprint_1.default.findById(sprintId);
            if (!selectedSprint) {
                return res.status(404).json({
                    IsSuccess: false,
                    Errors: ["Such sprint does not exists."],
                });
            }
            const result = yield Sprint_1.default.findByIdAndRemove(sprintId);
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
                    Errors: ["Could not delete the sprint"],
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
exports.deleteSprint = deleteSprint;
const checkInputValidity = (projectId, sprintName, startDate, endDate) => {
    const inputs = [
        {
            fieldValue: projectId,
            fieldName: "project id",
            validations: ["required"],
            minLength: 8,
            maxLength: 20,
        },
        {
            fieldValue: sprintName,
            fieldName: "sprint name",
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
