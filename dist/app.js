"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const project_1 = __importDefault(require("./routes/project"));
const sprint_1 = __importDefault(require("./routes/sprint"));
const task_1 = __importDefault(require("./routes/task"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/auth", auth_1.default);
app.use("/project", project_1.default);
app.use("/sprint", sprint_1.default);
app.use("/task", task_1.default);
app.get("/", (req, res) => {
    res.send("Server running");
});
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        IsSuccess: false,
        Errors: [message],
    });
});
mongoose_1.default
    .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
})
    .catch((err) => console.log(err));
