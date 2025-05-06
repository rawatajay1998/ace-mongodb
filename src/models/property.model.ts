import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  projectName: string;
  propertyType: string;
  propertyStatus: string;
  city: string;
  area: string;
  areaSize: number;
  thumbnailImage: string;
  bannerImage: string;
  mobileBannerImage: string;
  description: string;
  locality: string;
  bathrooms: number;
  beds: number;
  propertyPrice: number;
  verified: boolean;
  slug: string;
  postedBy: mongoose.Types.ObjectId; // reference to User
}

const PropertySchema = new Schema<IProperty>(
  {
    projectName: { type: String, required: true },
    propertyType: { type: String, required: true },
    propertyStatus: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    areaSize: { type: Number, required: true },
    thumbnailImage: { type: String, required: true },
    bannerImage: { type: String, required: true },
    mobileBannerImage: { type: String, required: true },
    description: { type: String, required: true },
    locality: { type: String, required: true },
    bathrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    propertyPrice: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
