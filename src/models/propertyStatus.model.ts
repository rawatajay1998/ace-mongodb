import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyStatus extends Document {
  name: string;
}

const PropertyStatusSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const PropertyStatus =
  mongoose.models.PropertyStatus ||
  mongoose.model<IPropertyStatus>("PropertyStatus", PropertyStatusSchema);

export default PropertyStatus;
