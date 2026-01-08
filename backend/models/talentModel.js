import mongoose from 'mongoose';

const talentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['Dancer', 'Singer', 'Fine Artist', 'Musician', 'Performer'],
        required: true
    },
    image: {
        url: String,
        publicId: String
    }
}, { timestamps: true });

const Talent = mongoose.model('Talent', talentSchema);
export default Talent;
