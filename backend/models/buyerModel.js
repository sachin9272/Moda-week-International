import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
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
    businessType: {
        type: String,
        required: true
    },
    productInterests: {
        type: String
    },
    additionalInfo: {
        type: String
    }
}, { timestamps: true });

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;
