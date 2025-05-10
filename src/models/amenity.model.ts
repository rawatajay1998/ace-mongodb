import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Amenity ||
  mongoose.model("Amenity", AmenitySchema);
