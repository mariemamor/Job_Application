import { Router } from "express";
import { register, login } from "../controllers/auth.controllers";

const router = Router();

// Define routes
router.post("/register", register);
router.post("/login", login);

export default router; // ✅ Important
