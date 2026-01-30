import mongoose from 'mongoose';

const philanthropySchema = new mongoose.Schema({
    // Singleton pattern - we'll only have one document
    isDefault: { type: Boolean, default: true, unique: true },

    header: {
        title: { type: String, default: "PHILANTHROPY" },
        subtitleLine1: { type: String, default: "Back to the Community" },
        subtitleLine2: { type: String, default: "Fashion With Purpose" }
    },

    introduction: {
        leadText: { type: String, default: "At Moda Week International (MWINTL), philanthropy is an essential pillar of our mission..." },
        column1: { type: String },
        column2: { type: String }
    },

    // Flexible sections (Community, Events, Digital)
    sections: [{
        id: { type: String }, // 'community', 'events', 'digital'
        title: { type: String },
        description: { type: String }, // Can handle HTML/Rich text
        tagline: { type: String }, // "Inclusive Spaces", "Cultural Experience", etc.
        image: {
            url: { type: String },
            publicId: { type: String }
        },
        video: {
            url: { type: String },
            publicId: { type: String }
        },
        order: { type: Number, default: 0 },
        layout: { type: String, enum: ['text-left', 'text-right'], default: 'text-left' }
    }],

    philosophy: {
        title: { type: String, default: "Our Philanthropic Philosophy" },
        text: { type: String },
        authorName: { type: String, default: "Esmeralda Harwood" },
        authorTitle: { type: String, default: "CEO / Philanthropist & MWINTL Committee Team" }
    },

    slideshowImages: [{
        url: { type: String, required: true },
        publicId: { type: String }
    }]
}, { timestamps: true });

// Ensure only one document exists
philanthropySchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Philanthropy').countDocuments();
        if (count > 0) {
            next(new Error('Cannot create more than one Philanthropy document.'));
        }
    }
    next();
});

const Philanthropy = mongoose.model('Philanthropy', philanthropySchema);

export default Philanthropy;
