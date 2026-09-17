import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    name: String,

    url: {
      type: String,
      default: "",
    },

    key: {
      type: String,
      required: true,
    },

    mime: String,
    size: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Media", mediaSchema);