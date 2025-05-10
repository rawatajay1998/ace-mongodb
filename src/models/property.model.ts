import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IProperty extends Document {
  projectName: string;
  propertyType: mongoose.Types.ObjectId;
  propertyStatus: string;
  propertyCategory: mongoose.Types.ObjectId;
  city: string;
  country: string;
  downPayment: string;
  handoverDate: string;
  areaSize: number;
  thumbnailImage: string;
  bannerImage: string;
  description: string;
  locality: string;
  bathrooms: number;
  beds: number;
  propertyPrice: number;
  verified: boolean;
  slug: string;
  postedBy: mongoose.Types.ObjectId | IUser;
  galleryImages: string[];
  floorPlansImages: string[];
  about: string;
  locationAdvantages: string;
  pricingSection: string;
  amenities: string[];
  faqs: IFAQ[];
}

const PropertySchema = new Schema<IProperty>(
  {
    projectName: { type: String, required: true, index: true },
    propertyType: {
      type: Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
      index: true,
    },

    propertyCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    propertyStatus: { type: String, required: true },
    city: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    downPayment: { type: String, required: true },
    handoverDate: { type: String, required: true },
    areaSize: { type: Number, required: true, index: true },
    thumbnailImage: { type: String, required: true },
    bannerImage: { type: String, required: true },
    description: { type: String, required: true },
    locality: { type: String, required: true },
    bathrooms: { type: Number, required: true, index: true },
    beds: { type: Number, required: true, index: true },
    propertyPrice: { type: Number, required: true, index: true },
    verified: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    galleryImages: { type: [String], default: [] },
    floorPlansImages: { type: [String], default: [] },
    about: { type: String, required: true },
    locationAdvantages: { type: String, required: true },
    pricingSection: { type: String, required: true },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
PropertySchema.index(
  {
    projectName: "text",
    description: "text",
    city: "text",
    country: "text",
    locality: "text",
  },
  {
    name: "property_search_index",
    weights: {
      projectName: 5,
      description: 3,
      city: 2,
      country: 1,
      locality: 1,
    },
  }
);

// Compound indexes for common query patterns
PropertySchema.index({ propertyType: 1, propertyPrice: 1 });
PropertySchema.index({ city: 1, propertyType: 1 });
PropertySchema.index({ beds: 1, bathrooms: 1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
