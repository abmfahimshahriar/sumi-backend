import  cloudinary from 'cloudinary';
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/project";
import sprintRoutes from "./routes/sprint";
import taskRoutes from "./routes/task";
import userRoutes from "./routes/user";

import mongoose from "mongoose";
import { HttpException } from "./exceptions/httpException";
import multer from "multer";
import path from "path";

dotenv.config();

const app: Application = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('images', express.static(path.join(__dirname, 'images')));


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
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/sprint", sprintRoutes);
app.use("/task", taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.use(
  (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
      IsSuccess: false,
      Errors: [message],
    });
  }
);

mongoose
  .connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
