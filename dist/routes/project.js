"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = require("../controllers/project/project");
const authCheck_1 = require("../middleware/authCheck");
const router = express_1.default.Router();
router.post("/createProject", authCheck_1.authCheck, project_1.createProject);
router.get("/myCreatedProjects", authCheck_1.authCheck, project_1.getMyCreatedProjects);
router.get("/myInvolvedProjects", authCheck_1.authCheck, project_1.getMyInvolvedProjects);
router.put("/updateProject/:projectId", authCheck_1.authCheck, project_1.updateProject);
router.delete("/deleteProject/:projectId", authCheck_1.authCheck, project_1.deleteProject);
router.post("/getUsers", authCheck_1.authCheck, project_1.getUsers);
exports.default = router;
