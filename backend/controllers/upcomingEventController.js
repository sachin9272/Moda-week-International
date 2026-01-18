import UpcomingEvent from '../models/upcomingEventModel.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';

// Create a new upcoming event
export const createUpcomingEvent = async (req, res) => {
    try {
        const { title, eventDate, location, description } = req.body;

        // Parse ticketTypes if it's a string (from FormData)
        let ticketTypes = [];
        if (req.body.ticketTypes) {
            try {
                ticketTypes = JSON.parse(req.body.ticketTypes);
            } catch (e) {
                console.error("Error parsing ticketTypes JSON:", e);
                return res.status(400).json({ message: "Invalid ticketTypes format" });
            }
        }

        const files = req.files || [];
        const coverImageFile = files.find(f => f.fieldname === 'coverImage');
        const coverImage = coverImageFile ? { url: coverImageFile.path, publicId: coverImageFile.filename } : null;

        const newEvent = new UpcomingEvent({
            title,
            eventDate,
            location,
            description,
            coverImage,
            ticketTypes
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("Error creating upcoming event:", error);
        res.status(500).json({ message: "Failed to create upcoming event", error: error.message });
    }
};

// Get all upcoming events
export const getUpcomingEvents = async (req, res) => {
    try {
        const events = await UpcomingEvent.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ message: "Failed to fetch upcoming events", error: error.message });
    }
};

// Get single upcoming event by ID
export const getUpcomingEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await UpcomingEvent.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching upcoming event:", error);
        res.status(500).json({ message: "Failed to fetch upcoming event", error: error.message });
    }
};

// Update an upcoming event
export const updateUpcomingEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, eventDate, location, description } = req.body;

        const event = await UpcomingEvent.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        let ticketTypes = [];
        if (req.body.ticketTypes) {
            try {
                ticketTypes = JSON.parse(req.body.ticketTypes);
            } catch (e) {
                console.error("Error parsing ticketTypes JSON:", e);
            }
        }

        const files = req.files || [];
        const coverImageFile = files.find(f => f.fieldname === 'coverImage');

        // Handle Cover Image
        if (coverImageFile) {
            // New file uploaded, delete old
            if (event.coverImage && event.coverImage.publicId) {
                await deleteCloudinaryAsset(event.coverImage.publicId, 'image');
            }
            event.coverImage = { url: coverImageFile.path, publicId: coverImageFile.filename };
        }
        // Note: If no new file and no "remove" flag, we assume keeping existing is default behavior unless explicitly cleared? 
        // Usually FormData won't send the file field if not changed. 
        // If we want to allow removing the image without replacing, we'd need a flag or empty value logic. 
        // For now, assume if not sent, keep existing.

        if (title) event.title = title;
        if (eventDate) event.eventDate = eventDate;
        if (location) event.location = location;
        if (description) event.description = description;
        if (req.body.ticketTypes) event.ticketTypes = ticketTypes;

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating upcoming event:", error);
        res.status(500).json({ message: "Failed to update upcoming event", error: error.message });
    }
};

// Delete an upcoming event
export const deleteUpcomingEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await UpcomingEvent.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        if (event.coverImage && event.coverImage.publicId) {
            await deleteCloudinaryAsset(event.coverImage.publicId, 'image');
        }

        await UpcomingEvent.findByIdAndDelete(id);

        res.status(200).json({ message: "Upcoming event deleted successfully" });
    } catch (error) {
        console.error("Error deleting upcoming event:", error);
        res.status(500).json({ message: "Failed to delete upcoming event", error: error.message });
    }
};
