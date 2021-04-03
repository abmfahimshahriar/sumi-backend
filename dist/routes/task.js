"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("./../controllers/task/task");
const express_1 = __importDefault(require("express"));
const authCheck_1 = require("../middleware/authCheck");
const router = express_1.default.Router();
router.post("/createTask", authCheck_1.authCheck, task_1.createTask);
router.get("/getTasks/:sprintId", authCheck_1.authCheck, task_1.getTasks);
router.put("/updateTask", authCheck_1.authCheck, task_1.updateTask);
router.post("/deleteTask", authCheck_1.authCheck, task_1.deleteTask);
router.post("/bucketChange", authCheck_1.authCheck, task_1.changeBucket);
router.post("/createComment", authCheck_1.authCheck, task_1.createComment);
router.post("/getComments", authCheck_1.authCheck, task_1.getComments);
exports.default = router;
