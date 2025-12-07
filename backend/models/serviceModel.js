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
    requestParticipation: [{
        type: String
    }],
    additionalInfo: {
        type: String
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
