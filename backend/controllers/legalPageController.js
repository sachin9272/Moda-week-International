import LegalPage from '../models/legalPageModel.js';

// Get a legal page by type
export const getLegalPage = async (req, res) => {
    try {
        const { type } = req.params;
        const page = await LegalPage.findOne({ type });

        if (!page) {
            // Return empty structure if not found so frontend doesn't crash
            return res.json({
                type,
                title: '',
                content: ''
            });
        }
        res.json(page);
    } catch (error) {
        console.error('Error fetching legal page:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update or create a legal page
export const updateLegalPage = async (req, res) => {
    try {
        const { type } = req.params;
        const { title, content } = req.body;

        const page = await LegalPage.findOneAndUpdate(
            { type },
            {
                type,
                title,
                content,
                lastUpdated: Date.now()
            },
            { new: true, upsert: true } // Create if not exists
        );

        res.json(page);
    } catch (error) {
        console.error('Error updating legal page:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
