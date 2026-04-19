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
    instagram: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['Designer', 'Student', 'Host', 'Dancer', 'Fine Artist', 'Singer', 'Feature Model', 'Producer'],
        default: 'Designer',
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    image: {
        url: String,
        publicId: String
    }
}, { timestamps: true });

const FashionDesigner = mongoose.model('FashionDesigner', fashionDesignerSchema);
export default FashionDesigner;
