import express from "express";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/jobs.routes";
import JobApplicationRoutes from "./routes/jobApplication.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", JobApplicationRoutes);

export default app;
