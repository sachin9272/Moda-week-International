import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contactName: {
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
    industry: {
        type: String
    },
    sponsorshipInterests: [{
        type: String
    }],
    additionalInfo: {
        type: String
    },
    // New Fields
    jobTitle: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    fax: { type: String },
    website: { type: String },
    sponsorshipRegions: [{ type: String }]
}, { timestamps: true });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);
export default Sponsor;
