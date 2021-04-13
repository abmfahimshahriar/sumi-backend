import { getNotifications, readNotification } from './../controllers/notification/notification';
import express from "express";
import { authCheck } from "../middleware/authCheck";

const router = express.Router();

router.get("/getNotifications/:pageNumber", authCheck, getNotifications);
router.post("/readNotification", authCheck, readNotification);

export default router;
