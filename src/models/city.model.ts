import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
});

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
