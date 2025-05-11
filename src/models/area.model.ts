import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
  name: string;
  cityId: mongoose.Types.ObjectId;
}

const AreaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
});

export default mongoose.models.Area ||
  mongoose.model<IArea>("Area", AreaSchema);
