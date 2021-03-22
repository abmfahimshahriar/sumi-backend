import express from "express";
import { authCheck } from "../middleware/authCheck";
import {createSprint, getSprints} from "../controllers/sprint/sprint";

const router = express.Router();

router.post("/createSprint", authCheck, createSprint);
router.get("/getSprints/:projectId", authCheck, getSprints);

export default router;