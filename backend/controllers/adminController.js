import Buyer from '../models/buyerModel.js';
import Designer from '../models/designerModel.js';
import Sponsor from '../models/sponsorModel.js';
import Service from '../models/serviceModel.js';
import News from '../models/newsModel.js';
import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Auth
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && (await admin.matchPassword(password))) {
            res.json({
                success: true,
                _id: admin._id,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }
        const admin = await Admin.create({ email, password });
        if (admin) {
            res.status(201).json({
                success: true,
                _id: admin._id,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const buyerCount = await Buyer.countDocuments();
        const designerCount = await Designer.countDocuments();
        const sponsorCount = await Sponsor.countDocuments();
        const serviceCount = await Service.countDocuments();
        const newsCount = await News.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                buyers: buyerCount,
                designers: designerCount,
                sponsors: sponsorCount,
                services: serviceCount,
                news: newsCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Buyers ---
export const getAllBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: buyers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBuyer = async (req, res) => {
    try {
        await Buyer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Buyer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Designers ---
export const getAllDesigners = async (req, res) => {
    try {
        const designers = await Designer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: designers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDesigner = async (req, res) => {
    try {
        await Designer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Designer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Sponsors ---
export const getAllSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: sponsors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSponsor = async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Sponsor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Services ---
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
