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
    image: {
        url: String,
        publicId: String
    }
}, { timestamps: true });

const FashionDesigner = mongoose.model('FashionDesigner', fashionDesignerSchema);
export default FashionDesigner;
