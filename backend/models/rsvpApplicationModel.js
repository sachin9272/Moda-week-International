import mongoose from "mongoose";

const rsvpApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    nationality: { type: String, required: true },
    residenceCity: { type: String, required: true },
    directContact: { type: String, required: true },
    privateEmail: { type: String, required: true },
    organization: { type: String, required: true },
    roleTitle: { type: String, required: true },
    sector: { type: String, required: true },
    website: { type: String, default: "" },
    alignment: [{ type: String }],
    otherInterest: { type: String, default: "" },
    qualifications: [{ type: String }],
    confidentiality: [{ type: String }],
    signatureName: { type: String, required: true },
    signatureDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const RsvpApplication = mongoose.model("RsvpApplication", rsvpApplicationSchema);
export default RsvpApplication;
