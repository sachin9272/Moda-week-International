import PressAndMedia from '../models/pressAndMediaModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// Create a new media member
export const createMediaMember = async (req, res) => {
    try {
        const { name, country, countryCode, instagram, website, role } = req.body;
        const file = req.file;

        let image = null;
        if (file) {
            image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const newMember = new PressAndMedia({
            name,
            country,
            countryCode,
            instagram,
            website,
            role: role || 'Media representative',
            image
        });

        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        console.error("Error creating media member:", error);
        res.status(500).json({ message: "Failed to create media member", error: error.message });
    }
};

// Update a media member
export const updateMediaMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, countryCode, instagram, website, role } = req.body;
        const file = req.file;

        const member = await PressAndMedia.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Media member not found" });
        }

        // Update fields
        member.name = name || member.name;
        member.country = country || member.country;
        member.countryCode = countryCode || member.countryCode;
        if (instagram !== undefined) member.instagram = instagram;
        if (website !== undefined) member.website = website;
        if (role !== undefined) member.role = role;

        // Handle image update
        if (file) {
            // Delete old image
            if (member.image && member.image.publicId) {
                try {
                    await cloudinary.uploader.destroy(member.image.publicId);
                } catch (e) {
                    console.error("Failed to delete old image:", e);
                }
            }

            // Set new image
            member.image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const updatedMember = await member.save();
        res.status(200).json(updatedMember);
    } catch (error) {
        console.error("Error updating media member:", error);
        res.status(500).json({ message: "Failed to update media member", error: error.message });
    }
};

// Get all media members (with pagination, search, and country filter)
export const getMediaMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search || "";
        const country = req.query.country || "";
        const role = req.query.role || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (country) {
            query.country = country;
        }
        if (role) {
            query.role = { $regex: new RegExp(`^${role}$`, 'i') };
        }

        const members = await PressAndMedia.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const total = await PressAndMedia.countDocuments(query);

        res.status(200).json({
            members,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMembers: total
        });
    } catch (error) {
        console.error("Error fetching media members:", error);
        res.status(500).json({ message: "Failed to fetch media members", error: error.message });
    }
};

// Get single media member by ID
export const getMediaMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await PressAndMedia.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Media member not found" });
        }

        res.status(200).json(member);
    } catch (error) {
        console.error("Error fetching media member:", error);
        res.status(500).json({ message: "Failed to fetch media member", error: error.message });
    }
};

// Get list of unique countries with media members
export const getMediaMemberCountries = async (req, res) => {
    try {
        const countries = await PressAndMedia.distinct('country');
        res.status(200).json(countries);
    } catch (error) {
        console.error("Error fetching media member countries:", error);
        res.status(500).json({ message: "Failed to fetch countries", error: error.message });
    }
};

// Delete a media member
export const deleteMediaMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await PressAndMedia.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Media member not found" });
        }

        if (member.image && member.image.publicId) {
            try {
                await cloudinary.uploader.destroy(member.image.publicId);
            } catch (e) {
                console.error("Failed to delete image from Cloudinary", e);
            }
        }

        await PressAndMedia.findByIdAndDelete(id);
        res.status(200).json({ message: "Media member deleted successfully" });
    } catch (error) {
        console.error("Error deleting media member:", error);
        res.status(500).json({ message: "Failed to delete media member", error: error.message });
    }
};
