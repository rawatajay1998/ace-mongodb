// models/siteStat.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISiteStat extends Document {
  label: string;
  icon: string;
  url?: string;
}

const siteStatSchema = new Schema<ISiteStat>(
  {
    label: { type: String, required: true },
    icon: { type: String, required: true },
    url: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SiteStat ||
  mongoose.model<ISiteStat>("SiteStat", siteStatSchema);
