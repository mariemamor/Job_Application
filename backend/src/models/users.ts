import { Schema, model, Document, Types } from "mongoose";

// 1️⃣ Define a TypeScript interface for type safety
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    photo: string;
    jobsPosted: Types.ObjectId[];
    email: string;
    password: string;
    createdAt: Date;
      role: "user" | "admin" | "business"; // 🔹 role types

}

// 2️⃣ Create the Mongoose schema
const userSchema = new Schema<IUser>(
    {
         firstName: { 
            type: String,
             required: true 
            },
    lastName: { 
        type: String,
         required: true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
          photo: { 
            type: String, 
            default: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740&q=80" },
    jobsPosted: [{
         type: Schema.Types.ObjectId, 
         ref: "Job" 
        }],
          role: { 
      type: String, 
      enum: ["user", "admin", "business"], 
      default: "user" // default role for new users
    },
    },
    { timestamps: true } // automatically adds createdAt and updatedAt
);

// 3️⃣ Export the model
export const User = model<IUser>("User", userSchema);
