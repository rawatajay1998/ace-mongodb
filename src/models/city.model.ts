import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  cityImageUrl?: string;
  slug: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
  cityImageUrl: { type: String },
  slug: { type: String, required: true, unique: true },
});

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
