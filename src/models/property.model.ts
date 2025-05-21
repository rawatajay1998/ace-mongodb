import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IProperty extends Document {
  projectName: string;
  propertyType: mongoose.Types.ObjectId;
  propertyTypeName: string;
  propertyStatus: mongoose.Types.ObjectId;
  propertyStatusName: string;
  propertyCategory: mongoose.Types.ObjectId;
  propertyCategoryName: string;
  propertySubCategory: mongoose.Types.ObjectId;
  propertySubCategoryName: string;
  state: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  stateName: string;
  cityName: string;
  area: mongoose.Types.ObjectId;
  developer: mongoose.Types.ObjectId;
  developerName: string;
  areaName: string;
  metaTitle: string;
  metaDescription: string;
  paymentPlan: string;
  areaSize: string;
  thumbnailImage: string;
  bannerImage: string;
  propertyPrice: string;
  unitType: string;
  verified: boolean;
  slug: string;
  postedBy: mongoose.Types.ObjectId | IUser;
  galleryImages: string[];
  floorPlansImages: string[];
  aboutProperty: string;
  locationAdvantages: string;
  pricingSection: string;
  amenities: mongoose.Types.ObjectId[];
  faqs: IFAQ[];
  highROIProjects: boolean;
  exclusiveListing: boolean;
  featuredOnHomepage: boolean;
  brochure: string;
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
    propertyTypeName: {
      type: String,
      required: true,
    },
    propertyCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    propertyCategoryName: {
      type: String,
      required: true,
    },

    propertySubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
      index: true,
    },
    propertySubCategoryName: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    propertyStatus: {
      type: Schema.Types.ObjectId,
      ref: "PropertyStatus",
      required: true,
      index: true,
    },
    propertyStatusName: {
      type: String,
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
      index: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    developer: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },
    developerName: {
      type: String,
      required: true,
    },
    stateName: {
      type: String,
      required: true,
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
      index: true,
    },
    areaName: {
      type: String,
      required: true,
    },
    paymentPlan: { type: String },
    unitType: { type: String, required: true, index: true },
    areaSize: { type: String, required: true, index: true },
    thumbnailImage: { type: String, required: true },
    bannerImage: { type: String, required: true },
    propertyPrice: { type: String, required: true, index: true },
    verified: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    galleryImages: { type: [String], default: [] },
    floorPlansImages: { type: [String], default: [] },
    aboutProperty: { type: String, required: true },
    locationAdvantages: { type: String, required: true },
    pricingSection: { type: String, required: true },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    featuredOnHomepage: {
      type: Boolean,
      default: false,
    },
    highROIProjects: {
      type: Boolean,
      default: false,
    },
    exclusiveListing: {
      type: Boolean,
      default: false,
    },
    brochure: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
PropertySchema.index({ propertyType: 1, propertyPrice: 1 });
PropertySchema.index({ city: 1, propertyType: 1 });
PropertySchema.index({ state: 1, city: 1, area: 1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
