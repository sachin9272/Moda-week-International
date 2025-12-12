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
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LandingVideo = mongoose.model('LandingVideo', landingVideoSchema);
export default LandingVideo;
