"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.UserSchema = new mongoose_1.default.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    ProjectsCreated: { type: [String], required: true },
    ProjectsInvolved: { type: [String], required: true },
});
const User = mongoose_1.default.model('User', exports.UserSchema);
exports.default = User;
