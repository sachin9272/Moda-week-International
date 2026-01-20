import mongoose from 'mongoose';

const legalPageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['code-of-conduct', 'data-protection', 'media-release-policy', 'privacy-policy', 'terms-conditions']
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const LegalPage = mongoose.model('LegalPage', legalPageSchema);

export default LegalPage;
