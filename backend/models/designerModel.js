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
    },
    // Common Address Fields
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    fax: { type: String },
    socialMediaLink: { type: String },

    // Student Specific
    studentTeacher: { type: String },
    schoolAddress: { type: String },

    // New/Established Specific
    jobTitle: { type: String },
    companyName: { type: String },

    // Checkboxes / Interests
    collectionTypes: [{ type: String }],
    marketingInterest: [{ type: String }],
    showcaseLocation: [{ type: String }]
}, { timestamps: true });

const Designer = mongoose.model('Designer', designerSchema);
export default Designer;
