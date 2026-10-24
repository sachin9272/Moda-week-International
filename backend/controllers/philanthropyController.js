import Philanthropy from '../models/philanthropyModel.js';
import { deleteS3Asset } from '../utils/s3Helper.js';

// Get the Philanthropy page data (create default if not exists)
export const getPhilanthropy = async (req, res) => {
    try {
        let philanthropy = await Philanthropy.findOne({ isDefault: true });

        if (!philanthropy) {
            // Create default if it doesn't exist
            philanthropy = await Philanthropy.create({
                isDefault: true,
                sections: [
                    {
                        id: 'community',
                        title: 'Community Engagement',
                        description: 'MWINTL actively engages with local communities...',
                        tagline: 'Inclusive Spaces',
                        layout: 'text-left',
                        order: 1
                    },
                    {
                        id: 'events',
                        title: 'Community-Based Events',
                        description: 'Our fashion events are intentionally structured...',
                        tagline: 'Cultural Experience',
                        layout: 'text-right',
                        order: 2
                    },
                    {
                        id: 'digital',
                        title: 'Digital Visibility & Outreach',
                        description: 'MWINTL extends its philanthropic impact...',
                        tagline: 'Global Opportunity',
                        layout: 'text-left',
                        order: 3
                    }
                ]
            });
        }

        res.status(200).json(philanthropy);
    } catch (error) {
        console.error("Error fetching Philanthropy data:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Philanthropy page data
export const updatePhilanthropy = async (req, res) => {
    try {
        let philanthropy = await Philanthropy.findOne({ isDefault: true });
        if (!philanthropy) {
            return res.status(404).json({ message: "Philanthropy document not found" });
        }

        const data = JSON.parse(req.body.data); // Expecting JSON string in 'data' field

        // Update Text Fields
        if (data.header) philanthropy.header = { ...(philanthropy.header?.toObject ? philanthropy.header.toObject() : philanthropy.header), ...data.header };
        if (data.introduction) philanthropy.introduction = { ...(philanthropy.introduction?.toObject ? philanthropy.introduction.toObject() : philanthropy.introduction), ...data.introduction };
        if (data.philosophy) philanthropy.philosophy = { ...(philanthropy.philosophy?.toObject ? philanthropy.philosophy.toObject() : philanthropy.philosophy), ...data.philosophy };

        // Handle Sections Updates
        if (data.sections) {
            // Map incoming sections to preserve existing images if provided (or handle uploads)
            // Implementation note: The frontend should send the full array of sections.
            // We just need to handle the file uploads mapping to specific sections.

            // Deep merge or replacement logic depending on frontend implementation.
            // Simplest: Replace sections array, but we need to handle file uploads mapped by index or ID.

            // Let's iterate through incoming sections and update
            const updatedSections = await Promise.all(data.sections.map(async (section, index) => {
                let currentSection = philanthropy.sections.find(s => s.id === section.id) || {};

                let newImage = currentSection.image;
                let newVideo = currentSection.video;

                // Check for uploaded image for this section
                if (req.files && req.files[`sectionImage_${section.id}`]) {
                    // Delete old image if exists
                    if (currentSection.image && currentSection.image.publicId) {
                        try {
                            await deleteS3Asset(currentSection.image.publicId);
                        } catch (err) {
                            console.error(`Failed to delete old image for section ${section.id}:`, err);
                        }
                    }

                    const file = req.files[`sectionImage_${section.id}`][0];
                    newImage = { url: file.location, publicId: file.key };
                }

                // Check for uploaded video for this section
                if (req.files && req.files[`sectionVideo_${section.id}`]) {
                    // Delete old video if exists
                    if (currentSection.video && currentSection.video.publicId) {
                        try {
                            await deleteS3Asset(currentSection.video.publicId);
                        } catch (err) {
                            console.error(`Failed to delete old video for section ${section.id}:`, err);
                        }
                    }

                    const file = req.files[`sectionVideo_${section.id}`][0];
                    newVideo = { url: file.location, publicId: file.key };
                }

                return {
                    ...section,
                    image: newImage,
                    video: newVideo
                };
            }));

            philanthropy.sections = updatedSections;
        }

        // Handle Slideshow Images
        // 1. Add new images
        if (req.files && req.files['slideshowImages']) {
            const files = req.files['slideshowImages']; // Array of files
            for (const file of files) {
                philanthropy.slideshowImages.push({ url: file.location, publicId: file.key });
            }
        }

        // 2. Remove images (frontend sends list of publicIds to remove)
        if (data.removeSlideshowImages && Array.isArray(data.removeSlideshowImages)) {
            for (const publicId of data.removeSlideshowImages) {
                if (publicId) {
                    await deleteS3Asset(publicId);
                    philanthropy.slideshowImages = philanthropy.slideshowImages.filter(img => img.publicId !== publicId);
                }
            }
        }

        await philanthropy.save();
        res.status(200).json({ message: "Philanthropy page updated successfully", philanthropy });

    } catch (error) {
        console.error("Error updating Philanthropy data:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
