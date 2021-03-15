import express from "express";
import {createProject, getMyCreatedProjects, getMyInvolvedProjects} from "../controllers/project/project"
import {authCheck} from "../middleware/authCheck";

const router = express.Router();

router.post('/createProject', authCheck, createProject);
router.get('/myCreatedProjects', authCheck, getMyCreatedProjects);
router.get('/myInvolvedProjects', authCheck, getMyInvolvedProjects);


export default router;
