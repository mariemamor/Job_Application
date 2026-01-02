import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: number;

    postedBy: Types.ObjectId; // reference to a User
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        salary: { type: Number },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    { timestamps: true }
);

export const Job = model<IJob>("Job", jobSchema);
