import { createTask, getTasks, changeBucket } from './../controllers/task/task';
import express from "express";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.post("/createTask", authCheck, createTask);
router.get("/getTasks/:sprintId", authCheck, getTasks);
router.put("/updateTask", authCheck, );
router.post("/deleteTask", authCheck, );
router.post("/bucketChange", authCheck, changeBucket);
export default router;
