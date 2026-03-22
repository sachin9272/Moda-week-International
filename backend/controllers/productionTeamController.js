import ProductionTeam from '../models/productionTeamModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

const normalizeTeamMemberOrder = async () => {
    const members = await ProductionTeam.find().sort({ order: 1, createdAt: 1, _id: 1 });
    const needsNormalization = members.some((member, index) => member.order !== index + 1);

    if (!needsNormalization) {
        return members;
    }

    await Promise.all(
        members.map((member, index) =>
            ProductionTeam.findByIdAndUpdate(member._id, { order: index + 1 }, { new: false })
        )
    );

    return ProductionTeam.find().sort({ order: 1, createdAt: 1, _id: 1 });
};

// Create a new team member
export const createTeamMember = async (req, res) => {
    try {
        const { name, country, countryCode, instagram, website, role, description } = req.body;
        const file = req.file;

        await normalizeTeamMemberOrder();

        let image = null;
        if (file) {
            image = {
                url: file.path,
                publicId: file.filename
            };
        }

        const lastMember = await ProductionTeam.findOne().sort({ order: -1, createdAt: -1 });

        const newMember = new ProductionTeam({
            name,
            country,
            countryCode,
            instagram,
            website,
            role: role || 'Team Member',
            description,
            order: (lastMember?.order || 0) + 1,
            image
        });

        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        console.error("Error creating team member:", error);
        res.status(500).json({ message: "Failed to create team member", error: error.message });
    }
};

// Update a team member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, countryCode, instagram, website, role, description } = req.body;
        const file = req.file;

        const member = await ProductionTeam.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        // Update fields
        member.name = name || member.name;
        member.country = country || member.country;
        member.countryCode = countryCode || member.countryCode;
        if (instagram !== undefined) member.instagram = instagram;
        if (website !== undefined) member.website = website;
        if (role !== undefined) member.role = role;
        if (description !== undefined) member.description = description;

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
        console.error("Error updating team member:", error);
        res.status(500).json({ message: "Failed to update team member", error: error.message });
    }
};

// Get all team members (with pagination, search, and country filter)
export const getTeamMembers = async (req, res) => {
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

        await normalizeTeamMemberOrder();

        const members = await ProductionTeam.find(query)
            .sort({ order: 1, createdAt: 1, _id: 1 })
            .skip(skip)
            .limit(limit);

        const total = await ProductionTeam.countDocuments(query);

        res.status(200).json({
            members,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMembers: total
        });
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ message: "Failed to fetch team members", error: error.message });
    }
};

// Reorder team members
export const reorderTeamMembers = async (req, res) => {
    try {
        const { orders } = req.body;

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ message: 'Orders array is required' });
        }

        await Promise.all(
            orders.map(({ id, order }) =>
                ProductionTeam.findByIdAndUpdate(id, { order }, { new: false })
            )
        );

        const members = await ProductionTeam.find().sort({ order: 1, createdAt: 1, _id: 1 });
        res.status(200).json({ members });
    } catch (error) {
        console.error("Error reordering team members:", error);
        res.status(500).json({ message: "Failed to reorder team members", error: error.message });
    }
};

// Get single team member by ID
export const getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await ProductionTeam.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        res.status(200).json(member);
    } catch (error) {
        console.error("Error fetching team member:", error);
        res.status(500).json({ message: "Failed to fetch team member", error: error.message });
    }
};

// Get list of unique countries with team members
export const getTeamMemberCountries = async (req, res) => {
    try {
        const countries = await ProductionTeam.distinct('country');
        res.status(200).json(countries);
    } catch (error) {
        console.error("Error fetching team member countries:", error);
        res.status(500).json({ message: "Failed to fetch countries", error: error.message });
    }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await ProductionTeam.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        if (member.image && member.image.publicId) {
            try {
                await cloudinary.uploader.destroy(member.image.publicId);
            } catch (e) {
                console.error("Failed to delete image from Cloudinary", e);
            }
        }

        await ProductionTeam.findByIdAndDelete(id);
        res.status(200).json({ message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({ message: "Failed to delete team member", error: error.message });
    }
};
