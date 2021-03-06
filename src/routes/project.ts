import express from "express";
import {
  createProject,
  getMyCreatedProjects,
  getMyInvolvedProjects,
  updateProject,
  deleteProject,
  getUsers,
} from "../controllers/project/project";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.post("/createProject", authCheck, createProject);
router.get("/myCreatedProjects", authCheck, getMyCreatedProjects);
router.get("/myInvolvedProjects", authCheck, getMyInvolvedProjects);
router.put("/updateProject/:projectId", authCheck, updateProject);
router.delete("/deleteProject/:projectId", authCheck, deleteProject);
router.post("/getUsers", authCheck, getUsers);

export default router;
