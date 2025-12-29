import FashionDesigner from '../models/fashionDesignerModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// Create a new designer
export const createDesigner = async (req, res) => {
    try {
        const { name, country } = req.body;
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
            image
        });

        const savedDesigner = await newDesigner.save();
        res.status(201).json(savedDesigner);
    } catch (error) {
        console.error("Error creating designer:", error);
        res.status(500).json({ message: "Failed to create designer", error: error.message });
    }
};

// Get all designers
export const getDesigners = async (req, res) => {
    try {
        console.log("Fetching all designers...");
        const designers = await FashionDesigner.find().sort({ createdAt: -1 });
        res.status(200).json(designers);
    } catch (error) {
        console.error("Error fetching designers:", error);
        res.status(500).json({ message: "Failed to fetch designers", error: error.message });
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
