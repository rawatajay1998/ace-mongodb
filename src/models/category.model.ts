import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
}
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
