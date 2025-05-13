import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
  name: string;
  cityId: mongoose.Types.ObjectId;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  areaImageUrl?: string;
}

const AreaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
  topLocation: { type: Boolean, default: false },
  featuredOnHomepage: { type: Boolean, default: false },
  areaImageUrl: { type: String },
});

export default mongoose.models.Area ||
  mongoose.model<IArea>("Area", AreaSchema);
