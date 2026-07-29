import mongoose from 'mongoose';

const upcomingEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    eventName: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    eventDate: {
        type: String, // Keeping as string to match requested "event date"
        required: true,
    },
    eventTime: {
        type: String,
        trim: true,
        default: '',
    },
    location: {
        type: String,
        required: true,
    },
    dressCode: {
        type: String,
        trim: true,
        default: '',
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['live', 'hidden'],
        default: 'hidden'
    },
    showOnLandingPage: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    heroLayout: {
        type: String,
        enum: ['split', 'full', 'minimal'],
        default: 'split'
    },
    coverImage: {
        url: { type: String },
        publicId: { type: String }
    },
    ticketBannerImage: {
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
            currency: { type: String, default: 'USD' },
            limit: { type: Number, default: 100 },
            description: { type: String },
            image: {
                url: { type: String },
                publicId: { type: String }
            }
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
            day: {
                type: String,
                enum: ['1', '2', '3', '4', '5', 'custom'],
                required: false
            },
            dayLabel: {
                type: String,
                trim: true,
                default: ''
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
    descriptionSection: {
        title: { type: String },
        text: { type: String },
        image: {
            url: { type: String },
            publicId: { type: String }
        },
        credits: { type: String },
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
        publicId: { type: String },
        title: { type: String },
        isVisible: { type: Boolean, default: true }
    },
    partners: [{
        url: { type: String },
        publicId: { type: String }
    }]
}, { timestamps: true });

// Helper to remove publicId from response
upcomingEventSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.coverImage) delete ret.coverImage.publicId;
        if (ret.ticketBannerImage) delete ret.ticketBannerImage.publicId;

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

        if (ret.descriptionSection?.image) delete ret.descriptionSection.image.publicId;
        if (ret.videoSection) delete ret.videoSection.publicId;

        if (ret.ticketTypes && Array.isArray(ret.ticketTypes)) {
            ret.ticketTypes.forEach(ticket => {
                if (ticket.image) delete ticket.image.publicId;
            });
        }

        return ret;
    }
});

const UpcomingEvent = mongoose.model('UpcomingEvent', upcomingEventSchema);

export default UpcomingEvent;
