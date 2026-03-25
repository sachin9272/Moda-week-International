import mongoose from "mongoose";

const landingPageSchema = new mongoose.Schema(
    {
        modaIntroSection: {
            title: { type: String, default: "MODA WEEK INTERNATIONAL" },
            content: {
                type: String,
                default:
                    "We offer a international exposure business platform that showcases established, emerging fashion designers and business acumen . Our mission is to celebrate diversity, sustainability, and foster innovation. Through our comprehensive services, including fashion expos, international fashion events, and impactful marketing and promotion strategies, we aim to elevate the visibility and success of all our clientele participants and companies partnership.",
            },
            useDefaultImage: { type: Boolean, default: true },
            image: {
                url: { type: String, default: "" },
                publicId: { type: String, default: "" },
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("LandingPage", landingPageSchema);
