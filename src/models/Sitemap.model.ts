import mongoose from "mongoose";

const sitemapSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Sitemap ||
  mongoose.model("Sitemap", sitemapSchema);
