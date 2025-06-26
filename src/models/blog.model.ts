import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  title: String,
  subtitle: String,
  content: String,
  thumbnail: { type: String, required: true },
  date: { type: Date, default: Date.now },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
