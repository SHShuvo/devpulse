import express, { type Application, type Request, type Response } from "express";

const app : Application = express();
app.use(express.json());


app.get("/", (req : Request, res : Response) => {
  res.send("Welcome to DevPulse");
});

export default app;