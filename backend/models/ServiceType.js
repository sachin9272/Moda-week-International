import mongoose from 'mongoose';

const serviceTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        required: true
    },
    publicId: {
        type: String, // Cloudinary Public ID for deletion
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);
export default ServiceType;
