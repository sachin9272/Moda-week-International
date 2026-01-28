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
    status: {
        type: String,
        enum: ['live', 'hidden'],
        default: 'hidden'
    },
    coverImage: {
        url: { type: String },
        publicId: { type: String }
    },
    hasTickets: {
        type: Boolean,
        default: false
    },
    ticketTypes: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            limit: { type: Number, default: 100 },
            description: { type: String }
        }
    ],
    collections: [
        {
            title: { type: String, required: true },
            designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FashionDesigner' },
            subtitle: { type: String, required: false },
            description: { type: String, required: false },
            designerImage: {
                url: { type: String },
                publicId: { type: String }
            },
            layout: {
                type: String,
                enum: ['grid', 'masonry', 'highlight', 'carousel'],
                default: 'grid'
            },
            gridAspectRatio: {
                type: String,
                enum: ['portrait', 'landscape', 'square', 'auto'],
                default: 'portrait'
            },
            images: [{
                url: { type: String },
                publicId: { type: String }
            }],
        },
    ],
}, { timestamps: true });

// Helper to remove publicId from response
upcomingEventSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.coverImage) delete ret.coverImage.publicId;

        if (ret.collections && Array.isArray(ret.collections)) {
            ret.collections.forEach(col => {
                if (col.designerImage) delete col.designerImage.publicId;
                if (col.images && Array.isArray(col.images)) {
                    col.images.forEach(img => {
                        if (img) delete img.publicId;
                    });
                }
            });
        }
        return ret;
    }
});

const UpcomingEvent = mongoose.model('UpcomingEvent', upcomingEventSchema);

export default UpcomingEvent;
