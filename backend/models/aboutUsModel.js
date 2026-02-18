import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "WHAT IS MODA WEEK INTERNATIONAL" },
        subtitle: { type: String, default: "INTERNATIONAL FASHION SHOW PRODUCTION ORGANIZATION WITH THE PURPOSE OF CONVEYING GLAMOROUS EVENTS, EDUCATION & COMMUNITY SUPPORT." }
    },
    mainSection: {
        title: { type: String, default: "MODA WEEK INTERNATIONAL" },
        content: { type: String, default: "Moda Week International (MWINTL) is a prestigious philanthropic fashion show production and global business commerce platform..." },
        image: {
            url: { type: String },
            publicId: { type: String }
        }
    },
    foundationSection: {
        title: { type: String, default: "FOUNDATION" },
        subtitle: { type: String, default: "\"Leading the Way in Fashion and Education: The Chairwoman and CEO of Moda Week International\"" },
        content: { type: String, default: "I am deeply fascinated by the art of global fashion..." },
        image: {
            url: { type: String },
            publicId: { type: String }
        },
        quote: { type: String, default: "— Esmeralda Harwood | CEO" }
    },
    philosophySection: {
        title: { type: String, default: "OUR PHILOSOPHY" },
        content: { type: String, default: "Moda Week International (MWINTL) is a distinguished global platform..." },
        image: {
            url: { type: String },
            publicId: { type: String }
        }
    },
    globalPlatformSection: {
        title: { type: String, default: "A GLOBAL PLATFORM FOR VISIONARIES, CULTURE & INNOVATION" },
        description: { type: String, default: "MWINTL is the global platform where visionary leadership..." },
        cards: [
            {
                title: { type: String },
                image: {
                    url: { type: String },
                    publicId: { type: String }
                },
                description: { type: String }
            }
        ]
    }
}, { timestamps: true });

export default mongoose.model("AboutUs", aboutUsSchema);
