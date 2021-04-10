import express from "express";
import { updateUser, getUserDetails } from "../controllers/user/user";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.post("/updateUser", authCheck, updateUser);
router.get("/userDetails", authCheck, getUserDetails);

export default router;
