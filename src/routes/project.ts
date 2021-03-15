import express from "express";
import {createProject} from "../controllers/project/project"


const router = express.Router();

router.post('/createProject', createProject);




export default router;
