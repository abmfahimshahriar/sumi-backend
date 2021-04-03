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
exports.getComments = exports.createComment = exports.changeBucket = exports.getTasks = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const Sprint_1 = __importDefault(require("../../models/sprint/Sprint"));
const dotenv_1 = __importDefault(require("dotenv"));
const inputValidator_1 = require("../../utility/validators/inputValidator");
const helperFunctions_1 = require("../helper_functions/helperFunctions");
const User_1 = __importDefault(require("../../models/auth/User"));
const Project_1 = __importDefault(require("../../models/project/Project"));
const Task_1 = __importDefault(require("../../models/task/Task"));
const Comment_1 = __importDefault(require("../../models/task/Comment"));
dotenv_1.default.config();
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const taskName = req.body.TaskName;
    const taskDescription = req.body.TaskDescription;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    const storyPoints = req.body.StoryPoints;
    const assignee = req.body.Assignee;
    try {
        const userId = helperFunctions_1.getUserId(req);
        // const errorsObject = checkInputValidity(
        //   projectId,
        //   sprintid,
        //   taskName,
        //   sprintName,
        //   startDate,
        //   endDate
        // );
        // if (errorsObject.hasError) {
        //   return res.status(422).json({
        //     IsSuccess: false,
        //     Errors: errorsObject.errors,
        //   });
        // }
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not create task under this project"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
        let startBucket;
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (sprint) {
            startBucket = sprint.TaskBuckets.find((item) => item.TaskBucketId === sprint.StartBucket);
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No sprint found"],
            });
        }
        const sameName = yield Task_1.default.find({
            TaskName: taskName,
            CreatedBy: userId,
        });
        if (sameName.length > 0) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["A task with same name already exists for the user."],
            });
        }
        const task = new Task_1.default({
            ProjectId: projectId,
            SprintId: sprintId,
            TaskName: taskName,
            TaskDescription: taskDescription,
            StartDate: startDate,
            EndDate: endDate,
            CreatedBy: userId,
            StoryPoints: storyPoints,
            CurrentBucket: startBucket === null || startBucket === void 0 ? void 0 : startBucket.TaskBucketId,
            Assignee: assignee,
            IsDone: false,
        });
        const result = yield task.save();
        if (result) {
            project.TotalStoryPoints = project.TotalStoryPoints + storyPoints;
            sprint.TotalStoryPoints = sprint.TotalStoryPoints + storyPoints;
            const res1 = yield project.save();
            const res2 = yield sprint.save();
            // const res1 = updateSprintTotalStoryPoints(sprintId);
            // const res2 = updateProjectTotalStoryPoints(projectId);
            if (res1 && res2) {
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        TaskId: result._id,
                    },
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not create a task"],
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
exports.createTask = createTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const taskId = req.body.TaskId;
    const taskName = req.body.TaskName;
    const taskDescription = req.body.TaskDescription;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    const storyPoints = req.body.StoryPoints;
    const assignee = req.body.Assignee;
    try {
        const userId = helperFunctions_1.getUserId(req);
        // const errorsObject = checkInputValidity(
        //   projectId,
        //   sprintid,
        //   taskName,
        //   sprintName,
        //   startDate,
        //   endDate
        // );
        // if (errorsObject.hasError) {
        //   return res.status(422).json({
        //     IsSuccess: false,
        //     Errors: errorsObject.errors,
        //   });
        // }
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not update task under this project"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No sprint found"],
            });
        }
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such task does not exists."],
            });
        }
        const prevStoryPoints = task.StoryPoints;
        task.TaskName = taskName;
        task.TaskDescription = taskDescription;
        task.StartDate = startDate;
        task.EndDate = endDate;
        task.StoryPoints = storyPoints;
        task.Assignee = assignee;
        const result = yield task.save();
        if (result) {
            if (task.IsDone) {
                project.CompletedStoryPoints =
                    project.CompletedStoryPoints + storyPoints - prevStoryPoints;
                sprint.CompletedStoryPoints =
                    sprint.CompletedStoryPoints + storyPoints - prevStoryPoints;
            }
            project.TotalStoryPoints =
                project.TotalStoryPoints + storyPoints - prevStoryPoints;
            sprint.TotalStoryPoints =
                sprint.TotalStoryPoints + storyPoints - prevStoryPoints;
            const res1 = yield project.save();
            const res2 = yield sprint.save();
            // const res1 = updateSprintTotalStoryPoints(sprintId);
            // const res2 = updateProjectTotalStoryPoints(projectId);
            if (res1 && res2) {
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        TaskId: result._id,
                    },
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not update the task"],
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
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const taskId = req.body.TaskId;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not delete task under this project"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No sprint found"],
            });
        }
        const result = yield Task_1.default.findByIdAndRemove(taskId);
        if (!result) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such task does not exists."],
            });
        }
        if (result) {
            if (result.IsDone) {
                project.CompletedStoryPoints =
                    project.CompletedStoryPoints - result.StoryPoints;
                sprint.CompletedStoryPoints =
                    sprint.CompletedStoryPoints - result.StoryPoints;
            }
            project.TotalStoryPoints = project.TotalStoryPoints - result.StoryPoints;
            sprint.TotalStoryPoints = sprint.TotalStoryPoints - result.StoryPoints;
            const res1 = yield project.save();
            const res2 = yield sprint.save();
            // const res1 = updateSprintTotalStoryPoints(sprintId);
            // const res2 = updateProjectTotalStoryPoints(projectId);
            if (res1 && res2) {
                return res.status(201).json({
                    IsSuccess: true,
                    Result: {
                        TaskId: result._id,
                    },
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not delete the task"],
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
exports.deleteTask = deleteTask;
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = helperFunctions_1.getUserId(req);
    const sprintId = req.params.sprintId;
    const sprint = yield Sprint_1.default.findById(sprintId);
    if (sprint) {
        const tempTaskBuckets = sprint.TaskBuckets.filter(item => item.TaskBucketId != sprint.EndBucket);
        const endTaskBucket = sprint.TaskBuckets.find(item => item.TaskBucketId == sprint.EndBucket);
        if (endTaskBucket)
            tempTaskBuckets.push(endTaskBucket);
        sprint.TaskBuckets = [...tempTaskBuckets];
        const project = yield Project_1.default.findById(sprint.ProjectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not view the tasks under this project"],
                });
            }
            const tasks = yield Task_1.default.find({ SprintId: sprintId });
            return res.status(200).json({
                IsSuccess: true,
                Result: {
                    Sprint: sprint,
                    Tasks: tasks,
                },
            });
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
    }
    else {
        return res.status(422).json({
            IsSuccess: false,
            Errors: ["No sprint found"],
        });
    }
});
exports.getTasks = getTasks;
const changeBucket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = helperFunctions_1.getUserId(req);
    const taskId = req.body.TaskId;
    const newBucket = req.body.NewBucket;
    const task = yield Task_1.default.findById(taskId);
    const sprint = yield Sprint_1.default.findById(task === null || task === void 0 ? void 0 : task.SprintId);
    if (sprint && task) {
        const project = yield Project_1.default.findById(sprint.ProjectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: [
                        "You can not change the bucket of the task under this project",
                    ],
                });
            }
            const selectedNewBucket = sprint.TaskBuckets.find((item) => item.TaskBucketId === newBucket);
            if (!selectedNewBucket) {
                return res.status(422).json({
                    IsSuccess: false,
                    Errors: ["There is no such bucket"],
                });
            }
            if (task.IsDone) {
                task.CurrentBucket = newBucket;
                task.IsDone = false;
                const result = yield task.save();
                project.CompletedStoryPoints =
                    project.CompletedStoryPoints - task.StoryPoints;
                sprint.CompletedStoryPoints =
                    sprint.CompletedStoryPoints - task.StoryPoints;
                const res1 = yield project.save();
                const res2 = yield sprint.save();
                if (result && res1 && res2) {
                    return res.status(201).json({
                        IsSuccess: true,
                        Result: {
                            Task: task,
                        },
                    });
                }
            }
            else {
                if (sprint.EndBucket === newBucket) {
                    task.CurrentBucket = newBucket;
                    task.IsDone = true;
                    const result = yield task.save();
                    project.CompletedStoryPoints =
                        project.CompletedStoryPoints + task.StoryPoints;
                    sprint.CompletedStoryPoints =
                        sprint.CompletedStoryPoints + task.StoryPoints;
                    const res1 = yield project.save();
                    const res2 = yield sprint.save();
                    if (result && res1 && res2) {
                        return res.status(201).json({
                            IsSuccess: true,
                            Result: {
                                Task: task,
                            },
                        });
                    }
                }
                else {
                    task.CurrentBucket = newBucket;
                    const result = yield task.save();
                    if (result) {
                        return res.status(201).json({
                            IsSuccess: true,
                            Result: {
                                Task: task,
                            },
                        });
                    }
                }
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
    }
    else {
        return res.status(422).json({
            IsSuccess: false,
            Errors: ["No sprint found"],
        });
    }
});
exports.changeBucket = changeBucket;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const taskId = req.body.TaskId;
    const commentContent = req.body.CommentContent;
    // const commenter = req.body.Commenter;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const user = yield User_1.default.findById(userId).select("Email Name");
        // const errorsObject = checkInputValidity(
        //   projectId,
        //   sprintid,
        //   taskName,
        //   sprintName,
        //   startDate,
        //   endDate
        // );
        // if (errorsObject.hasError) {
        //   return res.status(422).json({
        //     IsSuccess: false,
        //     Errors: errorsObject.errors,
        //   });
        // }
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not comment on any task under this project"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No sprint found"],
            });
        }
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such task does not exists."],
            });
        }
        const comment = new Comment_1.default({
            ProjectId: projectId,
            SprintId: sprintId,
            TaskId: taskId,
            CommentContent: commentContent,
            Commenter: user,
            CommentedAt: new Date().toISOString(),
        });
        const result = yield comment.save();
        if (result) {
            return res.status(201).json({
                IsSuccess: true,
                Result: {
                    CommentId: result._id,
                },
            });
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Could not create a comment"],
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
exports.createComment = createComment;
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.body.ProjectId;
    const sprintId = req.body.SprintId;
    const taskId = req.body.TaskId;
    try {
        const userId = helperFunctions_1.getUserId(req);
        const project = yield Project_1.default.findById(projectId);
        if (project) {
            const involvedUsers = project.InvolvedUsers;
            const currentUser = involvedUsers.find((item) => item._id == userId);
            if (!currentUser) {
                return res.status(401).json({
                    IsSuccess: false,
                    Errors: ["You can not see comments of any task under this project"],
                });
            }
        }
        else {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No project found"],
            });
        }
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["No sprint found"],
            });
        }
        const task = yield Task_1.default.findById(taskId);
        if (!task) {
            return res.status(422).json({
                IsSuccess: false,
                Errors: ["Such task does not exists."],
            });
        }
        const comments = yield Comment_1.default.find({ TaskId: taskId });
        return res.status(200).json({
            IsSuccess: true,
            Result: {
                Task: task,
                Comments: comments,
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
exports.getComments = getComments;
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
