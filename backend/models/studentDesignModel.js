import mongoose from "mongoose";

const studentDesignSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  phone: {
    countryCode: {
      type: String,
      trim: true,
    },
    number: {
      type: String,
      trim: true,
    },
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  cityStateProvince: {
    type: String,
    trim: true,
  },
  zipPostalCode: {
    type: String,
    trim: true,
  },
  websiteOrSocialMedia: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  types: [
    {
      type: String,
      enum: [
        "Accessories",
        "Internship",
        "Men’s Fashion Collection",
        "Woman’s Fashion Collection",
        "Branding Creations",
      ],
    },
  ],
  interestedRegions: [
    {
      type: String,
      enum: ["CANADA", "EUROPE", "SOUTH AMERICA", "UNITED STATES"],
    },
  ],
  uploadFile: {
    type: String, // Cloudinary URL or file path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentDesign = mongoose.model("StudentDesign", studentDesignSchema);
export default StudentDesign;