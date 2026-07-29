import Partner from "../models/Partner.js";
import { deleteS3Asset } from '../utils/s3Helper.js';

// Create a new partner
export const createPartner = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a logo" });
        }

        const image = {
            url: req.file.location,
            publicId: req.file.key
        };

        const newPartner = new Partner({
            name: name || "Partner",
            image: image,
        });

        await newPartner.save();
        res.status(201).json(newPartner);
    } catch (error) {
        console.error("Error creating partner:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all partners
export const getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.status(200).json(partners);
    } catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete a partner
export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findById(id);

        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        // Delete image from Cloudinary
        if (partner.image && partner.image.publicId) {
            try {
                await deleteS3Asset(partner.image.publicId);
            } catch (e) {
                console.error("Failed to delete image from Cloudinary", e);
            }
        }

        await Partner.findByIdAndDelete(id);

        res.status(200).json({ message: "Partner deleted successfully" });
    } catch (error) {
        console.error("Error deleting partner:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
