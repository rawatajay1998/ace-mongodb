import mongoose, { Schema, Document } from "mongoose";

interface ISubCategoryCategory extends Document {
  name: string;
}
const SubCategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const SubCategory =
  mongoose.models.SubCategory ||
  mongoose.model<ISubCategoryCategory>("SubCategory", SubCategorySchema);

export default SubCategory;
