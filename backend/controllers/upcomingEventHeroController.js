import UpcomingEventHero from '../models/UpcomingEventHero.js';
// import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js'; // Not needed if we don't upload images for this

// Get Hero Data
export const getHero = async (req, res) => {
    try {
        let hero = await UpcomingEventHero.findOne();
        if (!hero) {
            hero = await UpcomingEventHero.create({});
        }
        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero data', error: error.message });
    }
};

// Update Hero Data (Title and Description only)
export const updateHero = async (req, res) => {
    try {
        const { title, description } = req.body;
        // ignoring subtitle and image as per request

        let updateData = { title, description };

        // If we were handling images, we would handle them here.
        // Since the requirement is to remove generic background image and subtitle, we skip them.

        let hero = await UpcomingEventHero.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.status(200).json({ message: 'Hero updated successfully', hero });
    } catch (error) {
        console.error("Error updating hero:", error);
        res.status(500).json({ message: 'Error updating hero data', error: error.message });
    }
};
