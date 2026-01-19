import express from "express";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/jobs.routes";
import JobApplicationRoutes from "./routes/jobApplication.routes";
import cors from "cors";
import dotenv from "dotenv";

const app = express();


dotenv.config();

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN as string;
console.log("FRONTEND_DOMAIN:", FRONTEND_DOMAIN);
app.use(
  cors({
    origin: FRONTEND_DOMAIN,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", JobApplicationRoutes);

export default app;
