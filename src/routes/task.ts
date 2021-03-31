import { createTask, getTasks, changeBucket, updateTask, deleteTask, createComment } from './../controllers/task/task';
import express from "express";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.post("/createTask", authCheck, createTask);
router.get("/getTasks/:sprintId", authCheck, getTasks);
router.put("/updateTask", authCheck, updateTask);
router.post("/deleteTask", authCheck, deleteTask);
router.post("/bucketChange", authCheck, changeBucket);
router.post("/createComment", authCheck, createComment);
router.post("/getComments", authCheck, createComment);
export default router;
