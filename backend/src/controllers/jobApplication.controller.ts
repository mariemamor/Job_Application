import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import { JobApplication } from "../models/jobApplication";
import { Job } from "../models/Job";
import { User } from "../models/users";

export const applyToJob = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId, resume, coverLetter, phone } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user?.firstName || !user.lastName || !user.email) {
            return res
                .status(400)
                .json({ status: false, message: "User profile is incomplete. First name, last name, and email are required." });
        }

        if (!jobId || !resume) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required fields: job and resume are required." });
        }
        // Only normal users can apply
        if (req.user?.role !== "user") {
            return res
                .status(403)
                .json({ status: false, message: "Only user accounts can apply for jobs" });
        }

        // Required fields
        if (!jobId || !resume) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required fields" });
        }

        // Check if job exists
        const jobExists = await Job.findById(jobId);
        if (!jobExists) {
            return res
                .status(404)
                .json({ status: false, message: "Job not found" });
        }

        // Check if user already applied
        const existing = await JobApplication.findOne({
            job: jobId,
            applicant: req.user._id,
        });
        if (existing) {
            return res
                .status(400)
                .json({ status: false, message: "You have already applied for this job" });
        }

        // Create job application
        const application = new JobApplication({
            job: jobId,
            applicant: req.user._id,
            resume,
            coverLetter,
            phone,
        });

        await application.save();

        return res
            .status(201)
            .json({ status: true, message: "Job application created successfully", data: application });
    } catch (err: unknown) {
        console.error(err);
        return res
            .status(500)
            .json({ status: false, message: "Server error. Try again." });
    }
};
 export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
        console.log("USER ID:", req.user?._id);
        const applications = await JobApplication.find({ applicant: req.user })
            .populate("job")
            .sort({ appliedAt: -1 });
       console.log("APPLICATIONS:", applications);
        return res
            .status(200)
            .json({ status: true, data: applications });
    }
  catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);  // This prints the error message
  } else {
    console.error(err);          // Fallback for non-Error objects
  }
  return res.status(500).json({ status: false, message: "erooooor" });
}
}



export const getApplicationsForJob = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.status(400).json({ status: false, message: "Job ID is required" });
        }

        if (req.user?.role !== "business" && req.user?.role !== "admin") {
            return res.status(403).json({ status: false, message: "Only business and admin accounts can create jobs" });
        }
        const applications = await JobApplication.find({ job: jobId })
            .populate("applicant")
            .sort({ appliedAt: -1 });

        return res
            .status(200)
            .json({ status: true, data: applications });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
}

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate role
    if (req.user?.role !== "business" && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Only business and admin accounts can update applications" });
    }

    // Validate status value
    const allowedStatuses = ["applied", "interviewing", "rejected", "accepted"];
    if (!status || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid status" });
    }

    // Find the application and populate the related job
    const application = await JobApplication.findById(id).populate<{ postedBy: string }>("job", "postedBy");
    if (!application) {
      return res
        .status(404)
        .json({ status: false, message: "Application not found" });
    }
console.log("APPLICATION JOB POSTED BY:", application);
    // TypeScript now knows that `application.job` has a `postedBy` field
    const jobPostedBy = application.postedBy.toString();
    if (req.user?.role !== "admin" && jobPostedBy !== req.user?._id) {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden: Only the business that posted this job or admin can update" });
    }

    // Update status
    application.status = status as typeof application.status;
    await application.save();

    return res
      .status(200)
      .json({ status: true, message: "Application status updated", data: application });
  } catch (err: unknown) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: "Server error. Try again." });
  }
};