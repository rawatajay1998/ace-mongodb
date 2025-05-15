import mongoose, { Schema, Document } from "mongoose";

// Interface defining the structure of the Job model
export interface IJob extends Document {
  title: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string[];
  isActive: boolean;
}

// Schema definition for Job
const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    location: { type: String },
    jobType: { type: String, required: true }, // Full-time, Part-time, Contract etc
    description: { type: String },
    requirements: { type: [String] }, // Array of skills/requirements
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Export the Job model or use existing one if it exists
export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
