import DonationPage from "../models/donationPageModel.js";
import { deleteS3Asset } from '../utils/s3Helper.js';

// Get Donation Page Content
export const getDonationPage = async (req, res) => {
    try {
        let page = await DonationPage.findOne();
        if (!page) {
            page = await DonationPage.create({});
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donation page data", error });
    }
};

// Update Donation Page Content
export const updateDonationPage = async (req, res) => {
    try {
        console.log("Update Donation Page Request Received");

        // If files are present, data is a JSON string in req.body.data
        // Otherwise, req.body is the data directly (for text-only updates if any)
        let updateData = req.body;
        if (req.headers['content-type']?.includes('multipart/form-data') && req.body.data) {
            try {
                updateData = JSON.parse(req.body.data);
            } catch (e) {
                console.error("Error parsing req.body.data:", e);
                return res.status(400).json({ message: "Invalid JSON data" });
            }
        }

        const { hero, mainContent, contactInfo, removeSlideshowImages } = updateData;

        let page = await DonationPage.findOne();
        if (!page) {
            page = new DonationPage({ hero, mainContent, contactInfo });
        } else {
            if (hero) page.hero = { ...page.hero, ...hero };
            if (mainContent) page.mainContent = { ...page.mainContent, ...mainContent };
            if (contactInfo) page.contactInfo = { ...page.contactInfo, ...contactInfo };
        }

        // Handle Slideshow Images
        // 1. Add new images
        if (req.files && req.files['slideshowImages']) {
            const files = req.files['slideshowImages'];
            for (const file of files) {
                // With multer-s3:
                // file.location -> S3 URL
                // file.key -> S3 object key
                console.log(`Image uploaded via middleware. URL: ${file.location}, Public ID: ${file.key}`);
                page.slideshowImages.push({ url: file.location, publicId: file.key });
            }
        }

        // 2. Remove images
        if (removeSlideshowImages && Array.isArray(removeSlideshowImages)) {
            console.log("Processing image removals:", removeSlideshowImages);
            for (const publicId of removeSlideshowImages) {
                if (publicId) {
                    try {
                        console.log(`Attempting to delete image with publicId: ${publicId}`);
                        const result = await deleteS3Asset(publicId, { invalidate: true });
                        console.log(`Cloudinary deletion result for ${publicId}:`, result);

                        if (result.result === 'ok' || result.result === 'not found') {
                            page.slideshowImages = page.slideshowImages.filter(img => img.publicId !== publicId);
                        } else {
                            console.warn(`Cloudinary did not return 'ok' for ${publicId}. Result: ${result.result}`);
                            // Still remove from DB if we want to force sync, or keep it? 
                            // Usually if it fails, we might want to retry or at least remove from DB if it's "not found".
                            // If it is 'not found', it means it's already gone from Cloudinary, so we should remove from DB.
                            page.slideshowImages = page.slideshowImages.filter(img => img.publicId !== publicId);
                        }

                    } catch (err) {
                        console.error(`Failed to delete image ${publicId}:`, err);
                    }
                }
            }
        }

        const savedPage = await page.save();
        res.status(200).json({ message: "Donation page updated successfully", page: savedPage });
    } catch (error) {
        console.error("Error updating donation page:", error);
        res.status(500).json({ message: "Error updating donation page data", error: error.toString() });
    }
};
