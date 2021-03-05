import express, {Application, Request, Response, NextFunction} from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
    res.send(`test project setup ${process.env.MONGODB_URI}`);
});

app.listen(5000, () => console.log("Server is running"));