import ServiceHero from '../models/ServiceHero.js';
import { cloudinary } from '../config/cloudinaryConfig.js';
// fs is not needed with multer-storage-cloudinary

// Get Hero Section Data
export const getHero = async (req, res) => {
    try {
        // Since there's only one hero section, we just find the first document or return default
        let hero = await ServiceHero.findOne();
        if (!hero) {
            hero = new ServiceHero(); // Return default values defined in schema
        }
        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero data', error: error.message });
    }
};

// Update Hero Section
export const updateHero = async (req, res) => {
    try {
        const { title, subtitle, description } = req.body;
        let updateData = { title, subtitle, description };

        // Handle Image Upload (already handled by multer-storage-cloudinary middleware)
        if (req.file) {
            // req.file.path is the secure_url from Cloudinary
            // req.file.filename is the public_id

            updateData.image = req.file.path;
            updateData.imageId = req.file.filename;

            // Delete old image from Cloudinary if replacing
            const oldHero = await ServiceHero.findOne();
            if (oldHero && oldHero.imageId) {
                // await cloudinary.uploader.destroy(oldHero.imageId);
                // Ideally we delete the old one. 
                // However, check if we aren't deleting the one we just uploaded if strict duplicates allowed? 
                // Unlikely with unique IDs.
                await cloudinary.uploader.destroy(oldHero.imageId);
            }
        }

        // Upsert: Update if exists, Insert if not
        const hero = await ServiceHero.findOneAndUpdate({}, updateData, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });

        res.status(200).json({ message: 'Hero section updated successfully', hero });
    } catch (error) {
        // No local file to cleanup since upload was direct to Cloudinary
        console.error("Error updating hero:", error);
        res.status(500).json({ message: 'Error updating hero section', error: error.message });
    }
};
