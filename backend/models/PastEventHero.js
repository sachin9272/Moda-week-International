import mongoose from 'mongoose';

const pastEventHeroSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Past Fashion Shows Events'
    },
    subtitle: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: "Celebrating our past and respectful supporters, collaborators and community"
    },
    image: {
        type: String,
        default: ''
    },
    imageId: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const PastEventHero = mongoose.model('PastEventHero', pastEventHeroSchema);

export default PastEventHero;
