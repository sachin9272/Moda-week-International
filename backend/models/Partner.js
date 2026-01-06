import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        publicId: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Partner = mongoose.model("Partner", partnerSchema);
export default Partner;
