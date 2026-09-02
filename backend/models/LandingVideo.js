import mongoose from 'mongoose';

const landingVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        default: '',
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['landing', 'newsroom'],
        default: 'landing'
    }
}, { timestamps: true });

const LandingVideo = mongoose.model('LandingVideo', landingVideoSchema);
export default LandingVideo;
