import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // your MongoDB connection
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/jobs.routes"
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;


app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


// Connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to start server", err);
});