
import { createJob, getJobs, getJobById, deleteJob, updateJob } from "../src/controllers/jobs.controllers";
import { Job } from "../src/models/Job";
import { Response } from "express";

jest.mock("../src/models/Job"); // keep this

describe("Job Controller", () => {
  let req: any;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  it("createJob: should create a job if user is business", async () => {
    req = {
      body: { title: "Dev", description: "Dev job", company: "Tech", location: "Berlin", salary: 5000 },
      user: { _id: "user123", role: "business" },
    };

    // ✅ Mock the Job constructor to save properties
    (Job as jest.Mock).mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);  // copy properties
      this.save = jest.fn().mockResolvedValue(this); // save returns itself
    });

    await createJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: true,
      data: expect.objectContaining({ title: "Dev" }),
    });
  });
      it("createJob: should return 403 if user is not business", async () => {
        req = { body: { title: "Dev" }, user: { _id: "user123", role: "user" } };
        await createJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Only business accounts can create jobs" });
    });

    it("createJob: should return 400 if required fields missing", async () => {
        req = { body: { title: "" }, user: { _id: "user123", role: "business" } };
        await createJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Missing required fields" });
    });

    it("getJobs: should return jobs", async () => {
        const fakeJobs = [{ title: "Dev" }, { title: "QA" }];
        (Job.find as jest.Mock).mockReturnValue({ populate: jest.fn().mockResolvedValue(fakeJobs) });

        await getJobs(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ status: true, data: fakeJobs });
    });

    it("getJobs: should return 500 if error occurs", async () => {
        (Job.find as jest.Mock).mockImplementation(() => { throw new Error("DB error"); });

        await getJobs(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Server error. Try again." });
    });

    it("getJobById: should return job if found", async () => {
        const fakeJob = { title: "Dev", postedBy: { firstName: "John" } };
        (Job.findById as jest.Mock).mockReturnValue({ populate: jest.fn().mockResolvedValue(fakeJob) });

        req = { params: { id: "job123" } };
        await getJobById(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ status: true, data: fakeJob });
    });

    it("getJobById: should return 404 if job not found", async () => {
        (Job.findById as jest.Mock).mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

        req = { params: { id: "job123" } };
        await getJobById(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Job not found" });
    });

    it("deleteJob: should delete job if postedBy matches", async () => {
        const fakeJob: any = { postedBy: "user123", deleteOne: jest.fn().mockResolvedValue(undefined) };
        (Job.findById as jest.Mock).mockResolvedValue(fakeJob);

        req = { params: { id: "job123" }, user: { _id: "user123", role: "business" } };
        await deleteJob(req as any, res as Response);

        expect(fakeJob.deleteOne).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ status: true, message: "Job deleted successfully" });
    });

    it("deleteJob: should return 403 if user is not owner or admin", async () => {
        const fakeJob: any = { postedBy: "someoneElse" };
        (Job.findById as jest.Mock).mockResolvedValue(fakeJob);

        req = { params: { id: "job123" }, user: { _id: "user123", role: "business" } };
        await deleteJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Forbidden" });
    });

    it("deleteJob: should return 404 if job not found", async () => {
        (Job.findById as jest.Mock).mockResolvedValue(null);
        req = { params: { id: "job123" }, user: { _id: "user123", role: "business" } };
        await deleteJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Job not found" });
    });

    it("updateJob: should update job if owner or admin", async () => {
        const fakeJob: any = { postedBy: "user123", save: jest.fn().mockResolvedValue(undefined), title: "Old Title" };
        (Job.findById as jest.Mock).mockResolvedValue(fakeJob);

        req = { params: { id: "job123" }, body: { title: "New Title" }, user: { _id: "user123", role: "business" } };
        await updateJob(req as any, res as Response);

        expect(fakeJob.save).toHaveBeenCalled();
        expect(fakeJob.title).toBe("New Title");
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ status: true, data: fakeJob });
    });

    it("updateJob: should return 403 if not owner or admin", async () => {
        const fakeJob: any = { postedBy: "someoneElse", save: jest.fn() };
        (Job.findById as jest.Mock).mockResolvedValue(fakeJob);

        req = { params: { id: "job123" }, body: { title: "New Title" }, user: { _id: "user123", role: "business" } };
        await updateJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Forbidden" });
    });

    it("updateJob: should return 404 if job not found", async () => {
        (Job.findById as jest.Mock).mockResolvedValue(null);

        req = { params: { id: "job123" }, body: { title: "New Title" }, user: { _id: "user123", role: "business" } };
        await updateJob(req as any, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Job not found" });
    });
});
