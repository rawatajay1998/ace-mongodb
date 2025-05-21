import mongoose, { Schema, Document, models } from "mongoose";

export interface IDeveloper extends Document {
  developerName: string;
  state: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  developerLogo: string;
  developerAbout: string;
  metaTitle: string;
  metaDescription: string;
}

const DeveloperSchema = new Schema<IDeveloper>(
  {
    developerName: { type: String, required: true },
    state: { type: Schema.Types.ObjectId, ref: "State", required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    developerLogo: { type: String }, // store Cloudinary URL or path
    developerAbout: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export default models.Developer ||
  mongoose.model<IDeveloper>("Developer", DeveloperSchema);
