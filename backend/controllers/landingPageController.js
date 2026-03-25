import LandingPage from "../models/landingPageModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

const getOrCreateLandingPage = async () => {
    let page = await LandingPage.findOne();
    if (!page) {
        page = await LandingPage.create({});
    }
    return page;
};

export const getLandingPage = async (req, res) => {
    try {
        const page = await getOrCreateLandingPage();
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: "Error fetching landing page data", error });
    }
};

export const updateLandingPage = async (req, res) => {
    try {
        let updateData = req.body;

        if (req.headers["content-type"]?.includes("multipart/form-data") && req.body.data) {
            try {
                updateData = JSON.parse(req.body.data);
            } catch (error) {
                return res.status(400).json({ message: "Invalid JSON data", error: error.toString() });
            }
        }

        const page = await getOrCreateLandingPage();
        const modaIntroSection = updateData.modaIntroSection || {};

        page.modaIntroSection = {
            ...page.modaIntroSection?.toObject?.(),
            ...modaIntroSection,
        };

        if (modaIntroSection.removeImage && page.modaIntroSection?.image?.publicId) {
            try {
                await cloudinary.uploader.destroy(page.modaIntroSection.image.publicId);
            } catch (error) {
                console.error("Failed to delete landing intro image:", error);
            }

            page.modaIntroSection.image = { url: "", publicId: "" };
        }

        if (modaIntroSection.removeImage) {
            page.modaIntroSection.useDefaultImage = false;
        }

        if (req.files?.modaIntroImage?.[0]) {
            const uploadedImage = req.files.modaIntroImage[0];

            if (page.modaIntroSection?.image?.publicId) {
                try {
                    await cloudinary.uploader.destroy(page.modaIntroSection.image.publicId);
                } catch (error) {
                    console.error("Failed to replace landing intro image:", error);
                }
            }

            page.modaIntroSection.image = {
                url: uploadedImage.path,
                publicId: uploadedImage.filename,
            };
            page.modaIntroSection.useDefaultImage = false;
        }

        const savedPage = await page.save();
        res.status(200).json({ message: "Landing page updated successfully", page: savedPage });
    } catch (error) {
        console.error("Error updating landing page:", error);
        res.status(500).json({ message: "Error updating landing page", error: error.toString() });
    }
};
