import mongoose from "mongoose";

const donationPageSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "MAKING A DIFFERENCE TOGETHER" },
        subtitle: { type: String, default: "" },
        description: { type: String, default: "Your support makes a difference and create a positive impact in our global and local communities." }
    },
    mainContent: {
        introText: {
            type: String,
            default: "Moda Week International (MWINTL) is a philanthropic platform that merges glamour with purpose. As a fashion show production organization, MWINTL is committed to creating impactful events that promote not only high fashion but also educational advancement and community empowerment.\n\nMWINTL is proudly defined by its dual mission: to showcase world-class fashion while fostering a culture of giving, learning, and social responsibility. Through each initiative, we promote artistic brilliance while uplifting lives."
        },
        powerOfGivingTitle: { type: String, default: "The Power of Giving Back" },
        powerOfGivingText: {
            type: String,
            default: "Every contribution serves a greater purpose, opening doors for emerging talent, supporting marginalized communities, and igniting hope through education and creative opportunities. From sponsorships and donations to mentorship, skill-building, and international outreach, our efforts are centered on purposeful collaboration and human empowerment."
        }
    },
    contactInfo: {
        email: { type: String, default: "info@modaweekinternational.com" }
    },
    slideshowImages: [
        {
            url: { type: String },
            publicId: { type: String }
        }
    ]
}, { timestamps: true });

export default mongoose.model("DonationPage", donationPageSchema);
