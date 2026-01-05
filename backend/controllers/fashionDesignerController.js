import FashionDesigner from '../models/fashionDesignerModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// Create a new designer
export const createDesigner = async (req, res) => {
    try {
        const { name, country, countryCode, socialMedia } = req.body;
        const file = req.file;

        let image = null;
        if (file) {
            image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const newDesigner = new FashionDesigner({
            name,
            country,
            countryCode,
            socialMedia,
            image
        });

        const savedDesigner = await newDesigner.save();
        res.status(201).json(savedDesigner);
    } catch (error) {
        console.error("Error creating designer:", error);
        res.status(500).json({ message: "Failed to create designer", error: error.message });
    }
};

// Update a designer
export const updateDesigner = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, countryCode, socialMedia } = req.body;
        const file = req.file;

        const designer = await FashionDesigner.findById(id);
        if (!designer) {
            return res.status(404).json({ message: "Designer not found" });
        }

        // Update fields
        designer.name = name || designer.name;
        designer.country = country || designer.country;
        designer.countryCode = countryCode || designer.countryCode;
        designer.socialMedia = socialMedia || designer.socialMedia;

        // Handle image update
        if (file) {
            // Delete old image
            if (designer.image && designer.image.publicId) {
                try {
                    await cloudinary.uploader.destroy(designer.image.publicId);
                } catch (e) {
                    console.error("Failed to delete old image:", e);
                }
            }

            // Set new image
            designer.image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const updatedDesigner = await designer.save();
        res.status(200).json(updatedDesigner);
    } catch (error) {
        console.error("Error updating designer:", error);
        res.status(500).json({ message: "Failed to update designer", error: error.message });
    }
};

// Get all designers (with pagination, search, and country filter)
export const getDesigners = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search || "";
        const country = req.query.country || "";
        const skip = (page - 1) * limit;

        console.log(`Fetching designers - Page: ${page}, Limit: ${limit}, Search: "${search}", Country: "${country}"`);

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (country) {
            query.country = country;
        }

        const designers = await FashionDesigner.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const total = await FashionDesigner.countDocuments(query);

        res.status(200).json({
            designers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDesigners: total
        });
    } catch (error) {
        console.error("Error fetching designers:", error);
        res.status(500).json({ message: "Failed to fetch designers", error: error.message });
    }
};

// Get single designer by ID
export const getDesignerById = async (req, res) => {
    try {
        const { id } = req.params;
        const designer = await FashionDesigner.findById(id);

        if (!designer) {
            return res.status(404).json({ message: "Designer not found" });
        }

        res.status(200).json(designer);
    } catch (error) {
        console.error("Error fetching designer:", error);
        res.status(500).json({ message: "Failed to fetch designer", error: error.message });
    }
};

// Get list of unique countries with designers
export const getDesignerCountries = async (req, res) => {
    try {
        const countries = await FashionDesigner.distinct('country');
        res.status(200).json(countries);
    } catch (error) {
        console.error("Error fetching designer countries:", error);
        res.status(500).json({ message: "Failed to fetch countries", error: error.message });
    }
};

// Delete a designer
export const deleteDesigner = async (req, res) => {
    try {
        const { id } = req.params;
        const designer = await FashionDesigner.findById(id);

        if (!designer) {
            return res.status(404).json({ message: "Designer not found" });
        }

        if (designer.image && designer.image.publicId) {
            try {
                await cloudinary.uploader.destroy(designer.image.publicId);
            } catch (e) {
                console.error("Failed to delete image from Cloudinary", e);
            }
        }

        await FashionDesigner.findByIdAndDelete(id);
        res.status(200).json({ message: "Designer deleted successfully" });
    } catch (error) {
        console.error("Error deleting designer:", error);
        res.status(500).json({ message: "Failed to delete designer", error: error.message });
    }
};
