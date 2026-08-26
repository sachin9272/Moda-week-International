import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    fullName: {
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
    requestParticipation: {
        type: String
    },
    additionalInfo: {
        type: String
    },
    // Press & Media Accreditation Fields
    companyName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    fax: { type: String },
    website: { type: String },
    currentEvent: { type: String },
    jobTitle: { type: String },
    date: { type: String },
    signature: { type: String },
    mediaReleaseNames: [{ type: String }],
    mediaName: { type: String },
    photo: {
        url: { type: String },
        publicId: { type: String }
    },

    // Volunteer & Internship Fields
    educationMajor: { type: String },
    schoolAddress: { type: String },
    volunteeringInterests: [{ type: String }],

    // Application Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
