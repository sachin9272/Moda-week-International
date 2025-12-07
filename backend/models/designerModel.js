import mongoose from 'mongoose';

const designerSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    designerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    designCategory: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: String
    },
    website: {
        type: String
    },
    portfolioLink: {
        type: String
    },
    brandDescription: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Designer = mongoose.model('Designer', designerSchema);
export default Designer;
