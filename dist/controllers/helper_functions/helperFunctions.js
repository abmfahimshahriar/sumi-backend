"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const getUserId = (req) => {
    const authHeader = req.get("Authorization");
    let userId = null;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt_decode_1.default(token);
        userId = decoded.UserId;
    }
    return userId;
};
exports.getUserId = getUserId;
