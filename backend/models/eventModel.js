import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    headerVideo: {
        type: String, // URL to video
        required: false,
    },
    collections: [
        {
            title: { type: String, required: true },
            subtitle: { type: String, required: false },
            images: [{ type: String }], // Array of image URLs
        },
    ],
    bottomSection: {
        image: { type: String },
        title: { type: String },
        text: { type: String },
    },
    eventType: {
        type: String,
        enum: ['past', 'upcoming', 'global'],
        default: 'upcoming'
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
