// models/propertyType.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyType extends Document {
  name: string;
}

const PropertyTypeSchema = new Schema<IPropertyType>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PropertyType ||
  mongoose.model<IPropertyType>("PropertyType", PropertyTypeSchema);
