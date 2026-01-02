import { Schema, model, Document, Types } from "mongoose";

export interface IJobApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  status: "applied" | "interviewing" | "rejected" | "accepted";
  appliedAt: Date;
  updatedAt: Date;
  resume?: string;
  coverLetter?: string;
  phone?: string;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "interviewing", "rejected", "accepted"],
      default: "applied",
    },
    resume: { type: String },
    coverLetter: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);


export const JobApplication = model<IJobApplication>("JobApplication", jobApplicationSchema);
