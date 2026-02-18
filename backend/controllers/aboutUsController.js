import AboutUs from "../models/aboutUsModel.js";
import { cloudinary } from '../config/cloudinaryConfig.js';

// Get About Us Page Content
export const getAboutUs = async (req, res) => {
    try {
        let page = await AboutUs.findOne();
        if (!page) {
            page = await AboutUs.create({});
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: "Error fetching About Us page data", error });
    }
};

// Update About Us Page Content
export const updateAboutUs = async (req, res) => {
    try {
        console.log("Update About Us Page Request Received");

        let updateData = req.body;
        if (req.headers['content-type']?.includes('multipart/form-data') && req.body.data) {
            try {
                updateData = JSON.parse(req.body.data);
            } catch (e) {
                console.error("Error parsing req.body.data:", e);
                return res.status(400).json({ message: "Invalid JSON data" });
            }
        }

        const { hero, mainSection, foundationSection, philosophySection, globalPlatformSection } = updateData;

        let page = await AboutUs.findOne();
        if (!page) {
            page = new AboutUs({ hero, mainSection, foundationSection, philosophySection, globalPlatformSection });
        } else {
            if (hero) page.hero = { ...page.hero, ...hero };
            if (mainSection) page.mainSection = { ...page.mainSection, ...mainSection };
            if (foundationSection) page.foundationSection = { ...page.foundationSection, ...foundationSection };
            if (philosophySection) page.philosophySection = { ...page.philosophySection, ...philosophySection };
            if (globalPlatformSection) page.globalPlatformSection = { ...page.globalPlatformSection, ...globalPlatformSection };
        }

        // Helper function to handle single image upload
        const handleImageUpload = async (file, currentImage, sectionName) => {
            if (file) {
                if (currentImage && currentImage.publicId) {
                    try {
                        await cloudinary.uploader.destroy(currentImage.publicId);
                    } catch (err) {
                        console.error(`Failed to delete old image for ${sectionName}:`, err);
                    }
                }
                return { url: file.path, publicId: file.filename };
            }
            return null;
        };

        if (req.files) {
            // Main Section Image
            if (req.files['mainSectionImage']) {
                const img = await handleImageUpload(req.files['mainSectionImage'][0], page.mainSection?.image, 'mainSection');
                if (img) page.mainSection.image = img;
            }

            // Foundation Section Image
            if (req.files['foundationSectionImage']) {
                const img = await handleImageUpload(req.files['foundationSectionImage'][0], page.foundationSection?.image, 'foundationSection');
                if (img) page.foundationSection.image = img;
            }

            // Philosophy Section Image
            if (req.files['philosophySectionImage']) {
                const img = await handleImageUpload(req.files['philosophySectionImage'][0], page.philosophySection?.image, 'philosophySection');
                if (img) page.philosophySection.image = img;
            }

            // Global Platform Cards Images
            // Expecting keys like 'globalPlatformCardImage_0', 'globalPlatformCardImage_1', etc.
            if (page.globalPlatformSection && page.globalPlatformSection.cards) {
                for (let i = 0; i < page.globalPlatformSection.cards.length; i++) {
                    const key = `globalPlatformCardImage_${i}`;
                    if (req.files[key]) {
                        const img = await handleImageUpload(req.files[key][0], page.globalPlatformSection.cards[i].image, `globalPlatformCard_${i}`);
                        if (img) page.globalPlatformSection.cards[i].image = img;
                    }
                }
            }
        }

        const savedPage = await page.save();
        res.status(200).json({ message: "About Us page updated successfully", page: savedPage });
    } catch (error) {
        console.error("Error updating About Us page:", error);
        res.status(500).json({ message: "Error updating About Us page data", error: error.toString() });
    }
};
