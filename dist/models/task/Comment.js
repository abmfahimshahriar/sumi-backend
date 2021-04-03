"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CommentSchema = new mongoose_1.default.Schema({
    ProjectId: { type: String, required: true },
    SprintId: { type: String, required: true },
    TaskId: { type: String, required: true },
    CommentContent: { type: String, required: true },
    CommentedAt: { type: Date, required: true },
    Commenter: {
        type: {
            Email: { type: String, required: true },
            Name: { type: String, required: true },
        },
        required: true,
    },
});
const Comment = mongoose_1.default.model("Comment", exports.CommentSchema);
exports.default = Comment;
