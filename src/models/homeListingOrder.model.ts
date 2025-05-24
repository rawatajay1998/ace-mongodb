import mongoose, { Schema } from "mongoose";

const homeListingOrderSchema = new Schema({
  tableName: {
    type: String,
    required: true,
    enum: [
      "offplan",
      "secondary",
      "rental",
      "high-roi-projects",
      "exclusive-projects",
      "top-locations",
    ],
    unique: true,
  },
  order: {
    type: [Schema.Types.ObjectId],
    required: true,
    default: [],
  },
});

export default mongoose.models.HomeOrder ||
  mongoose.model("HomeOrder", homeListingOrderSchema);
