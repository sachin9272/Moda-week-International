import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const rsvpPageSchema = new mongoose.Schema(
  {
    galaImage: {
      type: imageSchema,
      default: () => ({ url: "", publicId: "" }),
    },
    seatingImage: {
      type: imageSchema,
      default: () => ({ url: "", publicId: "" }),
    },
  },
  { timestamps: true }
);

export default mongoose.model("RsvpPage", rsvpPageSchema);
