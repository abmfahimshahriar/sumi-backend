"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.TaskSchema = new mongoose_1.default.Schema({
    ProjectId: { type: String, required: true },
    SprintId: { type: String, required: true },
    TaskName: { type: String, required: true },
    TaskDescription: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    CreatedBy: { type: String, required: true },
    StoryPoints: { type: Number, required: true },
    CurrentBucket: { type: String, required: true },
    Assignee: {
        type: {
            Email: { type: String, required: true },
            Name: { type: String, required: true },
        },
        required: true,
    },
    IsDone: { type: Boolean, required: true },
});
const Task = mongoose_1.default.model("Task", exports.TaskSchema);
exports.default = Task;
