import mongoose, { Schema, Document } from "mongoose";

export interface IState extends Document {
  name: string;
}

const StateSchema = new Schema<IState>({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.State ||
  mongoose.model<IState>("State", StateSchema);
