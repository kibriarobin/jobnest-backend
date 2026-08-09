import express, { Application, Request, Response } from "express";
import config from "./config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthRoutes } from "./modules/auth/auth.route";
import { JobRoutes } from "./modules/job/job.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("jobnest server");
});

app.use('/api/auth', AuthRoutes);

app.use('/api/jobs', JobRoutes);

export default app;