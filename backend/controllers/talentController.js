import Talent from '../models/talentModel.js';
import { deleteS3Asset } from '../utils/s3Helper.js';

// Create a new talent
export const createTalent = async (req, res) => {
    try {
        const { name, country, countryCode, instagram, website, category } = req.body;
        const file = req.file;

        let image = null;
        if (file) {
            image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const newTalent = new Talent({
            name,
            country,
            countryCode,
            instagram,
            website,
            category,
            image
        });

        const savedTalent = await newTalent.save();
        res.status(201).json(savedTalent);
    } catch (error) {
        console.error("Error creating talent:", error);
        res.status(500).json({ message: "Failed to create talent", error: error.message });
    }
};

// Update a talent
export const updateTalent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, countryCode, instagram, website, category } = req.body;
        const file = req.file;

        const talent = await Talent.findById(id);
        if (!talent) {
            return res.status(404).json({ message: "Talent not found" });
        }

        // Update fields
        talent.name = name || talent.name;
        talent.country = country || talent.country;
        talent.countryCode = countryCode || talent.countryCode;
        if (instagram !== undefined) talent.instagram = instagram;
        if (website !== undefined) talent.website = website;
        if (category !== undefined) talent.category = category;

        // Handle image update
        if (file) {
            // Delete old image
            if (talent.image && talent.image.publicId) {
                try {
                    await deleteS3Asset(talent.image.publicId);
                } catch (e) {
                    console.error("Failed to delete old image:", e);
                }
            }

            // Set new image
            talent.image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const updatedTalent = await talent.save();
        res.status(200).json(updatedTalent);
    } catch (error) {
        console.error("Error updating talent:", error);
        res.status(500).json({ message: "Failed to update talent", error: error.message });
    }
};

// Get all talents (with pagination, search, and country filter)
export const getTalents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search || "";
        const country = req.query.country || "";
        const category = req.query.category || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (country) {
            query.country = country;
        }
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        const talents = await Talent.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Talent.countDocuments(query);

        res.status(200).json({
            talents,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTalents: total
        });
    } catch (error) {
        console.error("Error fetching talents:", error);
        res.status(500).json({ message: "Failed to fetch talents", error: error.message });
    }
};

// Get single talent by ID
export const getTalentById = async (req, res) => {
    try {
        const { id } = req.params;
        const talent = await Talent.findById(id);

        if (!talent) {
            return res.status(404).json({ message: "Talent not found" });
        }

        res.status(200).json(talent);
    } catch (error) {
        console.error("Error fetching talent:", error);
        res.status(500).json({ message: "Failed to fetch talent", error: error.message });
    }
};

// Get list of unique countries with talents
export const getTalentCountries = async (req, res) => {
    try {
        const countries = await Talent.distinct('country');
        res.status(200).json(countries);
    } catch (error) {
        console.error("Error fetching talent countries:", error);
        res.status(500).json({ message: "Failed to fetch countries", error: error.message });
    }
};

// Delete a talent
export const deleteTalent = async (req, res) => {
    try {
        const { id } = req.params;
        const talent = await Talent.findById(id);

        if (!talent) {
            return res.status(404).json({ message: "Talent not found" });
        }

        if (talent.image && talent.image.publicId) {
            try {
                await deleteS3Asset(talent.image.publicId);
            } catch (e) {
                console.error("Failed to delete image from Cloudinary", e);
            }
        }

        await Talent.findByIdAndDelete(id);
        res.status(200).json({ message: "Talent deleted successfully" });
    } catch (error) {
        console.error("Error deleting talent:", error);
        res.status(500).json({ message: "Failed to delete talent", error: error.message });
    }
};
