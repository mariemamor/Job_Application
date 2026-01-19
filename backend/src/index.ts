import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import cors from "cors";


dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server", err);
  });
