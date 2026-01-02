import { Job } from "../models/Job";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";


export const createJob = async (req: AuthRequest, res: Response) => {
    try {
     const {title, description, company, location, salary}  = req.body;
      console.log("USER FROM TOKEN:", req.user);

       if (req.user?.role !== "business") {
      return res.status(403).json({ status: false, message: "Only business accounts can create jobs" });
        }
      if (!title || !description || !company || !location) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    
      const job = new Job({
        title,
        description,
        company,
        location,
        salary,
        postedBy: req.user?._id
      });

        await job.save();
        return res.status(201).json({ status: true, data: job });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
  };

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find().populate("postedBy", "firstName lastName email");
        return res.status(200).json({ status: true, data: jobs });
    }
    catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
}

export const getJobById = async (req: Request, res: Response) => {
    try {
        const job = await Job.findById(req.params.id).populate("postedBy", "firstName lastName email");
        if (!job) {
            return res.status(404).json({ status: false, message: "Job not found" });
        }
        return res.status(200).json({ status: true, data: job });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
}

export const deleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ status: false, message: "Job not found" });
        }
        // Only the user who posted the job or an admin can delete it
        if (job.postedBy.toString() !== req.user?._id && req.user?.role !== "admin") {
            return res.status(403).json({ status: false, message: "Forbidden" });
        }
        await job.deleteOne();
        return res.status(200).json({ status: true, message: "Job deleted successfully" });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
}

export const updateJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ status: false, message: "Job not found" });
        }
        // Only the user who posted the job or an admin can update it
        if (job.postedBy.toString() !== req.user?._id && req.user?.role !== "admin") {
            return res.status(403).json({ status: false, message: "Forbidden" });
        }

        const { title, description, company, location, salary } = req.body;
        if (title) job.title = title;
        if (description) job.description = description;
        if (company) job.company = company;
        if (location) job.location = location;
        if (salary !== undefined) job.salary = salary;

        await job.save();
        return res.status(200).json({ status: true, data: job });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
}

