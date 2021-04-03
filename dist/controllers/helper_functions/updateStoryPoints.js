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
exports.updateProjectTotalStoryPoints = exports.updateSprintTotalStoryPoints = void 0;
const Project_1 = __importDefault(require("../../models/project/Project"));
const Sprint_1 = __importDefault(require("../../models/sprint/Sprint"));
const Task_1 = __importDefault(require("../../models/task/Task"));
const updateSprintTotalStoryPoints = (sprintId) => __awaiter(void 0, void 0, void 0, function* () {
    const sprint = yield Sprint_1.default.findById(sprintId);
    if (sprint) {
        const tasks = yield Task_1.default.find({ SprintId: sprintId });
        let totalPoints = 0;
        tasks.map((item) => {
            totalPoints += item.StoryPoints;
        });
        sprint.TotalStoryPoints = totalPoints;
        return yield sprint.save();
    }
});
exports.updateSprintTotalStoryPoints = updateSprintTotalStoryPoints;
const updateProjectTotalStoryPoints = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield Project_1.default.findById(projectId);
    if (project) {
        const sprints = yield Sprint_1.default.find({ ProjectId: projectId });
        let totalPoints = 0;
        sprints.map((item) => {
            totalPoints += item.TotalStoryPoints;
        });
        project.TotalStoryPoints = totalPoints;
        return yield project.save();
    }
});
exports.updateProjectTotalStoryPoints = updateProjectTotalStoryPoints;
