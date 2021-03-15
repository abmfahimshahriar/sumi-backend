import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/project";
import mongoose from "mongoose";
import { HttpException } from "./exceptions/httpException";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/project", projectRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.use(
  (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  }
);

mongoose
  .connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => console.log(err));
