import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";

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

app.get("/", (req: Request, res: Response) => {
  res.send(`test project setup ${process.env.MONGODB_URI}`);
});

mongoose
    .connect(
        process.env.MONGODB_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(result => {
        console.log("server running");
        app.listen(process.env.PORT_NUMBER);
    })
    .catch(err => console.log(err));
