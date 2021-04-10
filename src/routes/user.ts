import express from "express";
import { updateUser } from "../controllers/user/user";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.post("/updateUser", authCheck, updateUser);

export default router;
