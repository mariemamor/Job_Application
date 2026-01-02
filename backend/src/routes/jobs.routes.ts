import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobs.controllers";

const router = Router();

/* ========= PUBLIC ROUTES ========= */
router.get("/all", getJobs);
router.get("/:id", getJobById);

/* ========= PROTECTED ROUTES ========= */
router.post(
  "/",
  requireAuth,
  createJob // role check happens inside controller
);

router.put(
  "/:id",
  requireAuth,
  updateJob // creator OR admin
);

router.delete(
  "/:id",
  requireAuth,
  deleteJob // creator OR admin
);

export default router;
