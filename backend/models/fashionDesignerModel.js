import mongoose from 'mongoose';

const fashionDesignerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    countryCode: {
        type: String, // ISO code e.g. "US"
        required: false // Optional for backward compatibility
    },
    socialMedia: {
        type: String,
        required: false
    },
    image: {
        url: String,
        publicId: String
    }
}, { timestamps: true });

const FashionDesigner = mongoose.model('FashionDesigner', fashionDesignerSchema);
export default FashionDesigner;
