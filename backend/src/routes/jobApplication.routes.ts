import { Router } from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/jobApplication.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, applyToJob); // user applies
router.get("/myjobs", requireAuth, getMyApplications); // Uses req.user._id
router.get("/job/:jobId", requireAuth, getApplicationsForJob); // business/admin
router.put("/:id", requireAuth, updateApplicationStatus);       // business/admin

export default router;
