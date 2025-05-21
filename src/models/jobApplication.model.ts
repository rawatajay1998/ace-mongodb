import mongoose, { Schema, Document } from "mongoose";

// Interface defining the structure of a Job Application
export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
}

// Schema definition for Job Application
const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverLetter: { type: String },
  },
  { timestamps: true }
);

// Export the JobApplication model or use existing one if it exists
export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
