import UpcomingEventHero from '../models/UpcomingEventHero.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';

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

export const updateHero = async (req, res) => {
    try {
        const { title, description, subtitle, removeImage } = req.body;

        const existingHero = await UpcomingEventHero.findOne();
        let updateData = { title, description, subtitle };

        if (req.file) {
            if (existingHero?.imageId) {
                await deleteCloudinaryAsset(existingHero.imageId, 'image');
            }
            updateData.image = req.file.path;
            updateData.imageId = req.file.filename;
        } else if (removeImage === 'true') {
            if (existingHero?.imageId) {
                await deleteCloudinaryAsset(existingHero.imageId, 'image');
            }
            updateData.image = '';
            updateData.imageId = '';
        }

        let hero = await UpcomingEventHero.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.status(200).json({ message: 'Hero updated successfully', hero });
    } catch (error) {
        console.error("Error updating hero:", error);
        res.status(500).json({ message: 'Error updating hero data', error: error.message });
    }
};
