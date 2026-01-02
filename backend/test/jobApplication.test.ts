import { Response } from "express";
import { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus } from "../src/controllers/jobApplication.controller";
import { JobApplication } from "../src/models/jobApplication";
import { Job } from "../src/models/Job";
import { User } from "../src/models/users";

jest.mock("../src/models/jobApplication");
jest.mock("../src/models/Job");
jest.mock("../src/models/users");

describe("JobApplication Controller", () => {
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

  /** ---------------- APPLY TO JOB ---------------- */
  it("applyToJob: should create a job application if user is normal", async () => {
    req = {
      body: { jobId: "job123", resume: "resume.pdf", coverLetter: "Hello", phone: "123456" },
      user: { _id: "user123", role: "user" },
    };

    (User.findById as jest.Mock).mockResolvedValue({
      _id: "user123",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
    });

    (Job.findById as jest.Mock).mockResolvedValue({ _id: "job123", title: "Dev" });
    (JobApplication.findOne as jest.Mock).mockResolvedValue(null);

    (JobApplication as jest.Mock).mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
    });

    await applyToJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: true,
        message: "Job application created successfully",
        data: expect.objectContaining({ job: "job123", applicant: "user123" }),
      })
    );
  });

  it("applyToJob: should return 403 if user is business", async () => {
    req = { body: { jobId: "job123", resume: "resume.pdf" }, user: { _id: "biz123", role: "business" } };

    await applyToJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Only user accounts can apply for jobs" });
  });

  it("applyToJob: should return 400 if missing required fields", async () => {
    req = { body: { jobId: "", resume: "" }, user: { _id: "user123", role: "user" } };

    await applyToJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: false, message: "Missing required fields: job and resume are required." })
    );
  });

  /** ---------------- GET MY APPLICATIONS ---------------- */
  it("getMyApplications: should return user's applications", async () => {
    req = { user: { _id: "user123" } };

    const fakeApplications = [{ job: { title: "Dev" } }, { job: { title: "QA" } }];
    (JobApplication.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(fakeApplications),
    });

    await getMyApplications(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ status: true, data: fakeApplications });
  });

  it("getMyApplications: should return 500 on error", async () => {
    req = { user: { _id: "user123" } };
    (JobApplication.find as jest.Mock).mockImplementation(() => { throw new Error("DB error"); });

    await getMyApplications(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "erooooor" });
  });

  /** ---------------- GET APPLICATIONS FOR JOB ---------------- */
  it("getApplicationsForJob: should return applications if user is business", async () => {
    req = { params: { jobId: "job123" }, user: { _id: "biz123", role: "business" } };
    const fakeApplications = [{ applicant: { firstName: "John" } }];
    (JobApplication.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(fakeApplications),
    });

    await getApplicationsForJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ status: true, data: fakeApplications });
  });

  it("getApplicationsForJob: should return 403 if user is normal", async () => {
    req = { params: { jobId: "job123" }, user: { _id: "user123", role: "user" } };
    await getApplicationsForJob(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Only business and admin accounts can create jobs" });
  });

  /** ---------------- UPDATE APPLICATION STATUS ---------------- */
  it("updateApplicationStatus: should update status if business or admin", async () => {
    req = {
      params: { id: "app123" },
      body: { status: "interviewing" },
      user: { _id: "biz123", role: "business" },
    };

    const fakeApplication: any = {
      _id: "app123",
      status: "applied",
      postedBy: "biz123",
      save: jest.fn().mockResolvedValue(true),
      job: { postedBy: "biz123" },
    };

    (JobApplication.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeApplication),
    });

    await updateApplicationStatus(req, res as Response);

    expect(fakeApplication.save).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: true, message: "Application status updated", data: fakeApplication })
    );
  });

  it("updateApplicationStatus: should return 400 if invalid status", async () => {
    req = { params: { id: "app123" }, body: { status: "unknown" }, user: { _id: "biz123", role: "business" } };

    await updateApplicationStatus(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Invalid status" });
  });

  it("updateApplicationStatus: should return 403 if normal user tries", async () => {
    req = { params: { id: "app123" }, body: { status: "applied" }, user: { _id: "user123", role: "user" } };

    await updateApplicationStatus(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ status: false, message: "Only business and admin accounts can update applications" });
  });
});
