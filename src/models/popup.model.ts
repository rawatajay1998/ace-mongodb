import mongoose, { Schema, Document } from "mongoose";

// Interface defining the structure of the Popup model
export interface IPopup extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyName?: string;
  popupSource?: string;
}

// Schema definition for Popup
const PopupSchema = new Schema<IPopup>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    propertyName: {
      type: String,
      default: null,
    },
    popupSource: {
      type: String,
      default: "Popup-page",
    },
  },
  { timestamps: true }
);

// Export the Popup model or use existing one if it exists
export default mongoose.models.Popup ||
  mongoose.model<IPopup>("Popup", PopupSchema);
