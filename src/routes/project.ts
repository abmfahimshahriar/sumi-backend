import express from "express";
import {createProject} from "../controllers/project/project"
import {authCheck} from "../middleware/authCheck";

const router = express.Router();

router.post('/createProject', authCheck, createProject);




export default router;
