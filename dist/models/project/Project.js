"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.ProjectSchema = new mongoose_1.default.Schema({
    ProjectName: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    CreatedBy: { type: String, required: true },
    InvolvedUsers: { type: [{
                Email: { type: String, required: true },
                Name: { type: String, required: true },
            }], required: true },
    TotalStoryPoints: { type: Number, required: true },
    CompletedStoryPoints: { type: Number, required: true },
});
const Project = mongoose_1.default.model('Project', exports.ProjectSchema);
exports.default = Project;
