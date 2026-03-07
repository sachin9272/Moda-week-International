import mongoose from 'mongoose';

const productionTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    countryCode: {
        type: String, // ISO code e.g. "US"
        required: false // Optional for backward compatibility
    },
    instagram: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    image: {
        url: String,
        publicId: String
    }
}, { timestamps: true });

const ProductionTeam = mongoose.model('ProductionTeam', productionTeamSchema);
export default ProductionTeam;
