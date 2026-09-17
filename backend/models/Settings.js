import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "site" },
    companyName: String,
    tagline: String,
    heroTitle: String,
    heroText: String,
    heroButtonLabel: String,
    heroButtonUrl: String,
    secondaryButtonLabel: String,
    secondaryButtonUrl: String,
    email: String,
    whatsapp: String,
    founderName: String,
    founderTitle: String,
    founderBio: String,
    about: String,
    mission: String,
    seoTitle: String,
    seoDescription: String,
    socials: {
      facebook: String,
      instagram: String,
      linkedin: String,
      github: String,
      youtube: String,
    },
    sections: {
      products: Boolean,
      services: Boolean,
      projects: Boolean,
      founder: Boolean,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Settings", schema);
