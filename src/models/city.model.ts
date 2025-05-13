import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  cityImageUrl?: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
  topLocation: { type: Boolean, default: false },
  featuredOnHomepage: { type: Boolean, default: false },
  cityImageUrl: { type: String },
});

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
