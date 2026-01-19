import { Router } from "express";
import { register, login, getUserByToken } from "../controllers/auth.controllers";
import { requireAuth } from "../middlewares/auth.middleware";
const router = Router();

// Define routes
router.post("/register", register);
router.post("/login", login);
router.get("/getUserByToken", requireAuth, getUserByToken);


export default router; // ✅ Important
