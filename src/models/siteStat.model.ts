// models/siteStat.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISiteStat extends Document {
  label: string; // e.g., "2.5 Billion Daily Sales"
  icon: string; // e.g., "trending-up" (can be a Feather/Icon name)
  order: number; // for sorting
}

const siteStatSchema = new Schema<ISiteStat>(
  {
    label: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.SiteStat ||
  mongoose.model<ISiteStat>("SiteStat", siteStatSchema);
