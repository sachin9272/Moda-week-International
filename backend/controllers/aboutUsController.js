import AboutUs from "../models/aboutUsModel.js";
import { deleteS3Asset } from '../utils/s3Helper.js';

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
            page = new AboutUs({});
        }

        if (hero) {
            if (!page.hero) page.hero = {};
            if (hero.title !== undefined) page.hero.title = hero.title;
            if (hero.subtitle !== undefined) page.hero.subtitle = hero.subtitle;
        }

        if (mainSection) {
            if (!page.mainSection) page.mainSection = {};
            if (mainSection.title !== undefined) page.mainSection.title = mainSection.title;
            if (mainSection.content !== undefined) page.mainSection.content = mainSection.content;
            if (mainSection.image && mainSection.image.url) {
                page.mainSection.image = {
                    url: mainSection.image.url,
                    publicId: mainSection.image.publicId || ''
                };
            }
        }

        if (foundationSection) {
            if (!page.foundationSection) page.foundationSection = {};
            if (foundationSection.title !== undefined) page.foundationSection.title = foundationSection.title;
            if (foundationSection.subtitle !== undefined) page.foundationSection.subtitle = foundationSection.subtitle;
            if (foundationSection.content !== undefined) page.foundationSection.content = foundationSection.content;
            if (foundationSection.quote !== undefined) page.foundationSection.quote = foundationSection.quote;
            if (foundationSection.image && foundationSection.image.url) {
                page.foundationSection.image = {
                    url: foundationSection.image.url,
                    publicId: foundationSection.image.publicId || ''
                };
            }
        }

        if (philosophySection) {
            if (!page.philosophySection) page.philosophySection = {};
            if (philosophySection.title !== undefined) page.philosophySection.title = philosophySection.title;
            if (philosophySection.content !== undefined) page.philosophySection.content = philosophySection.content;
            if (philosophySection.image && philosophySection.image.url) {
                page.philosophySection.image = {
                    url: philosophySection.image.url,
                    publicId: philosophySection.image.publicId || ''
                };
            }
        }

        if (globalPlatformSection) {
            if (!page.globalPlatformSection) page.globalPlatformSection = { cards: [] };
            if (globalPlatformSection.title !== undefined) page.globalPlatformSection.title = globalPlatformSection.title;
            if (globalPlatformSection.description !== undefined) page.globalPlatformSection.description = globalPlatformSection.description;

            if (Array.isArray(globalPlatformSection.cards)) {
                const existingCards = page.globalPlatformSection.cards || [];
                page.globalPlatformSection.cards = globalPlatformSection.cards.map((card, idx) => {
                    const existingCard = existingCards[idx];
                    const existingImage = existingCard?.image;
                    const cardImage = (card.image && card.image.url)
                        ? card.image
                        : (existingImage && existingImage.url ? existingImage : null);

                    return {
                        title: card.title || '',
                        description: card.description || '',
                        image: cardImage ? { url: cardImage.url, publicId: cardImage.publicId || '' } : undefined
                    };
                });
            }
        }

        // Helper function to handle single image upload
        const handleImageUpload = async (file, currentImage, sectionName) => {
            if (file) {
                if (currentImage && currentImage.publicId) {
                    const isStockAsset = ['aboutus1.png', 'founder.png', 'founder2.jpg', 'addon1.jpg', 'addon2.jpg', 'addon3.jpg']
                        .some(stock => currentImage.publicId.endsWith(stock));
                    if (!isStockAsset) {
                        try {
                            await deleteS3Asset(currentImage.publicId);
                        } catch (err) {
                            console.error(`Failed to delete old image for ${sectionName}:`, err);
                        }
                    }
                }
                return { url: file.location, publicId: file.key };
            }
            return null;
        };

        if (req.files) {
            // Main Section Image
            if (req.files['mainSectionImage']?.[0]) {
                const img = await handleImageUpload(req.files['mainSectionImage'][0], page.mainSection?.image, 'mainSection');
                if (img) page.mainSection.image = img;
            }

            // Foundation Section Image
            if (req.files['foundationSectionImage']?.[0]) {
                const img = await handleImageUpload(req.files['foundationSectionImage'][0], page.foundationSection?.image, 'foundationSection');
                if (img) page.foundationSection.image = img;
            }

            // Philosophy Section Image
            if (req.files['philosophySectionImage']?.[0]) {
                const img = await handleImageUpload(req.files['philosophySectionImage'][0], page.philosophySection?.image, 'philosophySection');
                if (img) page.philosophySection.image = img;
            }

            // Global Platform Cards Images
            // Expecting keys like 'globalPlatformCardImage_0', 'globalPlatformCardImage_1', etc.
            if (page.globalPlatformSection && page.globalPlatformSection.cards) {
                for (let i = 0; i < page.globalPlatformSection.cards.length; i++) {
                    const key = `globalPlatformCardImage_${i}`;
                    if (req.files[key]?.[0]) {
                        const img = await handleImageUpload(req.files[key][0], page.globalPlatformSection.cards[i]?.image, `globalPlatformCard_${i}`);
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
