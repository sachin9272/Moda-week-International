import mongoose from 'mongoose';

const serviceHeroSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'COLLABORATION & EXPOSURE PLATFORM'
    },
    subtitle: {
        type: String,
        default: 'OUR SERVICES'
    },
    description: {
        type: String,
        default: 'Moda Week International offers a premier platform for companies and brands to showcase their presence through our international fashion show productions and global promotional events. By participating, partners gain direct visibility to high value audiences, international designers, media, VIPs, and commerce industry, while accessing exclusive networking opportunities that foster long term collaboration. Through aligned sponsorships, branding, and co-produced initiatives, MWINTL creates meaningful mutual growth and global impact uniting fashion, culture, and business on an international stage platform.'
    },
    image: {
        type: String,
        required: false
    },
    imageId: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('ServiceHero', serviceHeroSchema);

