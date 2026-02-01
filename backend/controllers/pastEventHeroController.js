import PastEventHero from '../models/PastEventHero.js';

// Get Hero Data
export const getHero = async (req, res) => {
    try {
        let hero = await PastEventHero.findOne();
        if (!hero) {
            hero = await PastEventHero.create({});
        }
        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero data', error: error.message });
    }
};

// Update Hero Data
export const updateHero = async (req, res) => {
    try {
        const { title, description } = req.body;
        // As per previous requests, we only focus on title and description, ignoring subtitle/image for now

        let updateData = { title, description };

        let hero = await PastEventHero.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.status(200).json({ message: 'Hero updated successfully', hero });
    } catch (error) {
        console.error("Error updating hero:", error);
        res.status(500).json({ message: 'Error updating hero data', error: error.message });
    }
};
