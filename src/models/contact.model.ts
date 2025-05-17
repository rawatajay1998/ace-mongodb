import mongoose, { Schema, Document } from "mongoose";

// Interface defining the structure of the Contact model
export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  propertyName: string;
  source: string;
}

// Schema definition for Contact
const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    message: { type: String, required: true },
    propertyName: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      default: "contact-page",
    },
  },
  { timestamps: true }
);

// Export the Contact model or use existing one if it exists
export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
