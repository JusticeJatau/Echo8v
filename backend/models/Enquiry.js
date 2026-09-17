import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 254 },
    organisation: { type: String, maxlength: 180 },
    interest: { type: String, maxlength: 180 },
    message: { type: String, required: true, maxlength: 6000 },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    emailSent: { type: Boolean, default: false },
    emailId: String,
    emailError: String,
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);
