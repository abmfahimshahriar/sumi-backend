"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authCheck_1 = require("../middleware/authCheck");
const sprint_1 = require("../controllers/sprint/sprint");
const router = express_1.default.Router();
router.post("/createSprint", authCheck_1.authCheck, sprint_1.createSprint);
router.get("/getSprints/:projectId", authCheck_1.authCheck, sprint_1.getSprints);
router.put("/updateSprint", authCheck_1.authCheck, sprint_1.updateSprint);
router.post("/deleteSprint", authCheck_1.authCheck, sprint_1.deleteSprint);
exports.default = router;
