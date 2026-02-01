import mongoose from 'mongoose';

const participantsHeroSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'MEET THE VISIONARY FASHION DESIGNERS & PARTICIPANTS'
    },
    subtitle: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: "Members of Moda Week International's platform showcase extraordinary talent across fashion design, performance arts, and fine arts. Their contributions extend beyond showcasing their talents—they influence the strategic direction that will define the industry's future."
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

const ParticipantsHero = mongoose.model('ParticipantsHero', participantsHeroSchema);

export default ParticipantsHero;
