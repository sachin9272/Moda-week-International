import mongoose from 'mongoose';

const upcomingEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    eventDate: {
        type: String, // Keeping as string to match requested "event date"
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    coverImage: {
        url: { type: String },
        publicId: { type: String }
    },
    ticketTypes: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            limit: { type: Number, default: 100 },
            description: { type: String }
        }
    ]
}, { timestamps: true });

// Helper to remove publicId from response
upcomingEventSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.coverImage) delete ret.coverImage.publicId;
        return ret;
    }
});

const UpcomingEvent = mongoose.model('UpcomingEvent', upcomingEventSchema);

export default UpcomingEvent;
