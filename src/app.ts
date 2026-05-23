import express, { type Application, type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { issuesRouter } from "./modules/issues/issues.routes";

const app : Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));


app.get("/", (req : Request, res : Response) => {
  res.send("Welcome to DevPulse");
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

export default app;