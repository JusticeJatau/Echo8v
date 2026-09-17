import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["product", "service", "project"],
      required: true,
    },
    title: { type: String, required: true, maxlength: 150 },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    summary: { type: String, maxlength: 500, default: "" },
    description: { type: String, maxlength: 20000, default: "" },
    category: { type: String, default: "" },
    availability: {
      type: String,
      enum: ["Available", "Demo available", "Coming soon"],
      default: "Demo available",
    },
    logo: { type: String, default: "" },
    cover: { type: String, default: "" },
    screenshots: [String],
    video: { type: String, default: "" },
    features: [String],
    buttonLabel: { type: String, default: "Try it out" },
    url: { type: String, default: "" },
    enquiryEnabled: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);
export default mongoose.model("Content", schema);
