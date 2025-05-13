import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  cityImageUrl?: string; // optional field for city image URL
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
  topLocation: { type: Boolean, default: false },
  featuredOnHomepage: { type: Boolean, default: false },
  cityImageUrl: { type: String }, // new field to store Cloudinary URL
});

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
