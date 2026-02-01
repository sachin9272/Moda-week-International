import mongoose from 'mongoose';

const upcomingEventHeroSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'UPCOMING EVENTS'
    },
    subtitle: {
        type: String,
        default: 'local or shared file'
    },
    description: {
        type: String,
        default: 'Experience world-class fashion events in the most ionic cities across the globe. Don\'t miss this strategic business opportunity to elevate your brand, gain visibility, and connect with industry leaders. Stay informed about upcoming fashion events, partnership opportunities, and participation options.'
    },
    image: {
        type: String,
        required: false
    },
    imageId: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('UpcomingEventHero', upcomingEventHeroSchema);
