import express from "express";
import {createProject, getMyCreatedProjects, getMyInvolvedProjects, updateProject} from "../controllers/project/project"
import {authCheck} from "../middleware/authCheck";

const router = express.Router();

router.post('/createProject', authCheck, createProject);
router.get('/myCreatedProjects', authCheck, getMyCreatedProjects);
router.get('/myInvolvedProjects', authCheck, getMyInvolvedProjects);
router.put('/updateProject/:projectId', authCheck, updateProject);

export default router;
