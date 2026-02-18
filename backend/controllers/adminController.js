import Buyer from '../models/buyerModel.js';
import Designer from '../models/designerModel.js';
import Sponsor from '../models/sponsorModel.js';
import Service from '../models/serviceModel.js';
import News from '../models/newsModel.js';
import Admin from '../models/adminModel.js';
import Event from '../models/eventModel.js';
import UpcomingEvent from '../models/upcomingEventModel.js';
import jwt from 'jsonwebtoken';
import { Jimp, loadFont, cssColorToHex } from 'jimp';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import sendEmail from '../utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        // Calculate the date 30 days ago
        const lastMonthDate = new Date();
        lastMonthDate.setDate(lastMonthDate.getDate() - 30);

        // Total counts
        const buyerCount = await Buyer.countDocuments();
        const designerCount = await Designer.countDocuments();
        const sponsorCount = await Sponsor.countDocuments();
        const serviceCount = await Service.countDocuments();
        const newsCount = await News.countDocuments();

        // Last month counts
        const buyersLastMonth = await Buyer.countDocuments({ createdAt: { $gte: lastMonthDate } });
        const designersLastMonth = await Designer.countDocuments({ createdAt: { $gte: lastMonthDate } });
        const sponsorsLastMonth = await Sponsor.countDocuments({ createdAt: { $gte: lastMonthDate } });
        const servicesLastMonth = await Service.countDocuments({ createdAt: { $gte: lastMonthDate } });

        // Event counts - Past events from Event model where eventType is 'past'
        const pastEventsCount = await Event.countDocuments({ eventType: 'past' });
        const pastEventsLastMonth = await Event.countDocuments({ eventType: 'past', createdAt: { $gte: lastMonthDate } });

        // Upcoming events from UpcomingEvent model
        const upcomingEventsCount = await UpcomingEvent.countDocuments();
        const upcomingEventsLastMonth = await UpcomingEvent.countDocuments({ createdAt: { $gte: lastMonthDate } });

        res.status(200).json({
            success: true,
            stats: {
                buyers: buyerCount,
                designers: designerCount,
                sponsors: sponsorCount,
                services: serviceCount,
                news: newsCount,
                buyersLastMonth,
                designersLastMonth,
                sponsorsLastMonth,
                servicesLastMonth,
                pastEvents: pastEventsCount,
                pastEventsLastMonth,
                upcomingEvents: upcomingEventsCount,
                upcomingEventsLastMonth
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

// Update Service Status
export const updateServiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service inquiry not found" });
        }

        service.status = status;
        await service.save();

        // If approved and is Press & Media, generate ID Card
        console.log(`Checking for ID Card generation. Status: ${status}, Request: ${service.requestParticipation}`);

        if (status === 'approved' && service.requestParticipation === 'Press & Media Accreditation') {
            console.log("Starting ID Card Generation...");
            try {
                // Generate QR Code
                const qrData = JSON.stringify({
                    id: service._id,
                    name: service.fullName,
                    type: "Press & Media",
                    event: service.currentEvent
                });
                console.log("QR Data prepared");
                const qrBuffer = await QRCode.toBuffer(qrData);
                console.log("QR Buffer generated");

                // Load Logo
                const logoPath = path.join(__dirname, '../assets/logo.png');
                let logo;
                try {
                    logo = await Jimp.read(logoPath);
                    logo.resize({ w: 100 });
                } catch (err) {
                    console.error("Error loading logo for ID card:", err);
                    // Continue without logo if fails, or handle error
                }

                // Create ID Card Image (600x900 - Portrait)
                const card = new Jimp({ width: 600, height: 900, color: cssColorToHex('#ffffff') });

                // Colors
                const brandColor = cssColorToHex('#C7913E'); // Gold
                const blackColor = cssColorToHex('#000000');
                const whiteColor = cssColorToHex('#ffffff');

                // 1. Top Strip
                const topStrip = new Jimp({ width: 600, height: 30, color: brandColor });
                card.composite(topStrip, 0, 0);

                // 2. Logo (Centered)
                if (logo) {
                    logo.resize({ w: 300 }); // Wider logo
                    const logoX = (600 - 300) / 2;
                    card.composite(logo, logoX, 60);
                }

                // 3. Badge Type Pill (Centered below logo)
                // Simulating a pill with a filled rectangle
                const pillWidth = 250;
                const pillHeight = 50;
                const pillX = (600 - pillWidth) / 2;
                const pillY = 180;
                const pill = new Jimp({ width: pillWidth, height: pillHeight, color: brandColor });
                card.composite(pill, pillX, pillY);

                // 4. Load Fonts
                const font32BlackPath = path.join(__dirname, '../node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');
                const font16BlackPath = path.join(__dirname, '../node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-16-black/open-sans-16-black.fnt');
                const font32WhitePath = path.join(__dirname, '../node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt');
                const font16WhitePath = path.join(__dirname, '../node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-16-white/open-sans-16-white.fnt');

                const fontName = await loadFont(font32BlackPath); // Name
                const fontCompany = await loadFont(font16BlackPath); // Company
                const fontPill = await loadFont(font32WhitePath); // "PRESS PASS" inside pill
                const fontFooterTitle = await loadFont(font32WhitePath); // Footer Title
                const fontFooterText = await loadFont(font16WhitePath); // Footer Details

                // 5. Text: "PRESS PASS" inside pill (Centered)
                // Manual centering estimation or use print alignment if available in v1.6 (usually maxWidth is supported)
                card.print({
                    font: fontPill,
                    x: pillX,
                    y: pillY + 5,
                    text: {
                        text: "PRESS PASS",
                        alignmentX: 2,
                        alignmentY: 16
                    },
                    maxWidth: pillWidth,
                    maxHeight: pillHeight
                });


                // 6. Body Content: Name, Company, QR Code
                // Name & Company (Left Aligned)
                const contentTextX = 50;
                const contentTextY = 300;

                card.print({ font: fontName, x: contentTextX, y: contentTextY, text: service.fullName.toUpperCase(), maxWidth: 350 });
                card.print({ font: fontCompany, x: contentTextX, y: contentTextY + 50, text: (service.mediaName || service.companyName || "").toUpperCase(), maxWidth: 350 });

                // QR Code (Right Aligned)
                const qrImage = await Jimp.read(qrBuffer);
                qrImage.resize({ w: 180, h: 180 });
                card.composite(qrImage, 380, 280);

                // 7. Footer (Bottom Block)
                const footerHeight = 250;
                const footerY = 900 - footerHeight;
                const footer = new Jimp({ width: 600, height: footerHeight, color: brandColor });
                card.composite(footer, 0, footerY);

                // Footer Text
                const footerPadding = 40;
                const footerTextY = footerY + footerPadding;

                // Event Description
                card.print({
                    font: fontFooterText,
                    x: footerPadding,
                    y: footerTextY,
                    text: "International Fashion & Textile Fair",
                    maxWidth: 520
                });

                // Date
                card.print({
                    font: fontFooterTitle,
                    x: footerPadding,
                    y: footerTextY + 50,
                    text: (service.currentEvent || "UPCOMING EVENT").toUpperCase(),
                    maxWidth: 520
                });

                // Location
                card.print({
                    font: fontFooterText,
                    x: footerPadding,
                    y: footerTextY + 120,
                    text: "ISTANBUL EXPO CENTER\nIstanbul, Turkey",
                    maxWidth: 520
                });

                // Save to buffer
                const cardBuffer = await card.getBuffer("image/png");
                console.log("Card Buffer created");

                // Send Email
                console.log("Sending email...");
                await sendEmail({
                    email: service.email,
                    subject: '✅ Press Accreditation Approved - Moda Week International',
                    message: `Dear ${service.fullName},\n\nYour application for Press & Media Accreditation has been APPROVED.\n\nPlease find your digital Press Pass attached to this email.\n\nBest regards,\nModa Week International Team`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #C7913E;">Application Approved</h2>
                            <p>Dear <strong>${service.fullName}</strong>,</p>
                            <p>We are pleased to inform you that your application for <strong>Press & Media Accreditation</strong> has been <strong>APPROVED</strong>.</p>
                            <p>Your digital Press Pass is attached to this email. Please present this pass at the event entry.</p>
                            <br/>
                            <p>Best Regards,</p>
                            <p><strong>Moda Week International Team</strong></p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: `PressPass-${service.fullName.replace(/\s+/g, '_')}.png`,
                            content: cardBuffer
                        }
                    ]
                });
                console.log("Email sent successfully");

            } catch (err) {
                console.error("Error generating ID card:", err);
                // Don't fail the request, just log error
            }
        } else {
            console.log("Skipping ID Card generation (Not Press & Media)");
            // Send Generic Approval Email
            console.log("Sending generic approval email...");
            try {
                await sendEmail({
                    email: service.email,
                    subject: '✅ Application Approved - Moda Week International',
                    message: `Dear ${service.fullName},\n\nYour application for ${service.requestParticipation} has been APPROVED.\n\nWe look forward to your participation.\n\nBest regards,\nModa Week International Team`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #C7913E;">Application Approved</h2>
                            <p>Dear <strong>${service.fullName}</strong>,</p>
                            <p>We are pleased to inform you that your application for <strong>${service.requestParticipation}</strong> has been <strong>APPROVED</strong>.</p>
                            <p>We look forward to your participation.</p>
                            <br/>
                            <p>Best Regards,</p>
                            <p><strong>Moda Week International Team</strong></p>
                        </div>
                    `
                });
                console.log("Generic approval email sent successfully");
            } catch (error) {
                console.error("Error sending generic approval email:", error);
            }
        }

        if (status === 'rejected') {
            await sendEmail({
                email: service.email,
                subject: 'Application Status Update - Moda Week International',
                message: `Dear ${service.fullName},\n\nThank you for your interest in Moda Week International.\n\nAfter careful review, we regret to inform you that we are unable to approve your application for Press & Media Accreditation at this time.\n\nBest regards,\nModa Week International Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Application Update</h2>
                        <p>Dear <strong>${service.fullName}</strong>,</p>
                        <p>Thank you for your interest in Moda Week International.</p>
                        <p>After careful review, we regret to inform you that we are unable to approve your application for <strong>Press & Media Accreditation</strong> at this time.</p>
                        <br/>
                        <p>Best Regards,</p>
                        <p><strong>Moda Week International Team</strong></p>
                    </div>
                `
            });
        }

        res.status(200).json({ success: true, message: `Service status updated to ${status}`, data: service });
    } catch (error) {
        console.error("Error updates service status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
