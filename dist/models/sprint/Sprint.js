"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.SprintSchema = new mongoose_1.default.Schema({
    ProjectId: { type: String, required: true },
    SprintName: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    CreatedBy: { type: String, required: true },
    TotalStoryPoints: { type: Number, required: true },
    CompletedStoryPoints: { type: Number, required: true },
    TaskBuckets: {
        type: [
            {
                TaskBucketId: { type: String, required: true },
                TaskBucketName: { type: String, required: true },
            },
        ],
        required: true,
    },
    StartBucket: { type: String, required: true },
    EndBucket: { type: String, required: true },
});
const Sprint = mongoose_1.default.model("Sprint", exports.SprintSchema);
exports.default = Sprint;
