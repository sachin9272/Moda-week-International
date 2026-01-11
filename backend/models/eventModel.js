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
        url: { type: String, required: true },
        publicId: { type: String }
    },
    headerVideo: {
        url: { type: String },
        publicId: { type: String }
    },
    heroLayout: {
        type: String,
        enum: ['split', 'full', 'minimal'],
        default: 'split'
    },
    collections: [
        {
            title: { type: String, required: true },
            designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FashionDesigner' }, // Link to Designer
            subtitle: { type: String, required: false },
            description: { type: String, required: false }, // Designer Biography
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
    bottomSection: {
        image: {
            url: { type: String },
            publicId: { type: String }
        },
        title: { type: String },
        text: { type: String },
        credits: { type: String }, // For Production Team / Credits list
    },
    eventType: {
        type: String,
        enum: ['past', 'upcoming', 'global'],
        default: 'upcoming'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    hasTickets: {
        type: Boolean,
        default: false
    },
    tickets: [
        {
            type: {
                type: String,
                enum: ['Student', 'General', 'VIP'],
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                default: 'USD'
            },
            amount: {
                type: Number,
                default: 100 // Available quantity
            },
            description: {
                type: String
            },
            image: {
                url: { type: String },
                publicId: { type: String }
            }
        }
    ],
    descriptionSection: {
        title: { type: String },
        text: { type: String },
        image: {
            url: { type: String },
            publicId: { type: String }
        },
        credits: { type: String }, // Functioning as Right Text
        isVisible: { type: Boolean, default: false },
        imageSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        }
    },
    videoSection: {
        type: { type: String, enum: ['upload', 'youtube'], default: 'youtube' },
        url: { type: String },
        publicId: { type: String }, // For uploads
        title: { type: String },
        isVisible: { type: Boolean, default: true }
    }
}, { timestamps: true });

eventSchema.set('toJSON', {
    transform: (doc, ret) => {
        // Remove publicId from thumbnail
        if (ret.thumbnail) delete ret.thumbnail.publicId;

        // Remove publicId from headerVideo
        if (ret.headerVideo) delete ret.headerVideo.publicId;

        // Remove publicId from bottomSection
        if (ret.bottomSection?.image) delete ret.bottomSection.image.publicId;

        // Remove publicId from descriptionSection
        if (ret.descriptionSection?.image) delete ret.descriptionSection.image.publicId;

        // Remove publicId from videoSection
        if (ret.videoSection) delete ret.videoSection.publicId;

        // Remove publicId from collections
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

        // Remove publicId from tickets
        if (ret.tickets && Array.isArray(ret.tickets)) {
            ret.tickets.forEach(ticket => {
                if (ticket.image) delete ticket.image.publicId;
            });
        }

        return ret;
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
