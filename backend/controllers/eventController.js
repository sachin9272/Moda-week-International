import Event from '../models/eventModel.js';

// Create a new event
// Create a new event
export const createEvent = async (req, res) => {
    try {
        // req.body fields will be strings because of FormData, so we need to parse JSON fields
        const { city, eventName, date, eventType } = req.body;

        let collections = [];
        if (req.body.collections) {
            try {
                collections = JSON.parse(req.body.collections);
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }
        }

        let bottomSection = {};
        if (req.body.bottomSection) {
            try {
                bottomSection = JSON.parse(req.body.bottomSection);
            } catch (e) {
                console.error("Error parsing bottomSection JSON:", e);
            }
        }

        // Map uploaded files
        const files = req.files || [];

        // Helper to get file URL
        const getFileUrl = (fieldname) => {
            const file = files.find(f => f.fieldname === fieldname);
            return file ? file.path : null;
        };

        const thumbnail = getFileUrl('thumbnail');
        const headerVideo = getFileUrl('headerVideo');
        const bottomSectionImage = getFileUrl('bottomSectionImage');

        if (bottomSectionImage) {
            bottomSection.image = bottomSectionImage;
        }

        const collectionsWithImages = collections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const imageUrls = colFiles.map(f => f.path);

            return {
                ...col,
                images: imageUrls
            };
        });

        const newEvent = new Event({
            city,
            eventName,
            date,
            eventType: eventType || 'upcoming',
            thumbnail: thumbnail || req.body.thumbnail,
            headerVideo: headerVideo || req.body.headerVideo,
            collections: collectionsWithImages,
            bottomSection,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event", error: error.message });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, eventName, date, eventType } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Parse JSON fields
        let collections = [];
        if (req.body.collections) {
            try {
                collections = JSON.parse(req.body.collections);
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }
        }

        let bottomSection = {};
        if (req.body.bottomSection) {
            try {
                bottomSection = JSON.parse(req.body.bottomSection);
            } catch (e) {
                console.error("Error parsing bottomSection JSON:", e);
            }
        } else if (event.bottomSection) {
            // Keep existing if not provided? Or parse if provided as string?
            // Since we construct the object in frontend, it should be sent. 
            // But if partial update, logic gets complex. 
            // We will assume full object is sent back for simplicity or handle partials carefully.
            // For now, let's assume the frontend sends the structure.
            bottomSection = event.bottomSection;
        }

        // Map uploaded files
        const files = req.files || [];
        const getFileUrl = (fieldname) => {
            const file = files.find(f => f.fieldname === fieldname);
            return file ? file.path : null;
        };

        // Update basic fields
        if (city) event.city = city;
        if (eventName) event.eventName = eventName;
        if (date) event.date = date;
        if (eventType) event.eventType = eventType;

        // Update files if new ones exist
        const thumbnail = getFileUrl('thumbnail');
        if (thumbnail) event.thumbnail = thumbnail;

        const headerVideo = getFileUrl('headerVideo');
        if (headerVideo) event.headerVideo = headerVideo;

        const bottomSectionImage = getFileUrl('bottomSectionImage');
        if (bottomSectionImage) bottomSection.image = bottomSectionImage;
        else if (req.body.bottomSection && JSON.parse(req.body.bottomSection).image) {
            // Keep existing image if URL passed back in JSON
            bottomSection.image = JSON.parse(req.body.bottomSection).image;
        }

        // Update Bottom Section
        // We merge existing with new text/title
        if (req.body.bottomSection) {
            const parsedBottom = JSON.parse(req.body.bottomSection);
            bottomSection.title = parsedBottom.title;
            bottomSection.text = parsedBottom.text;
            if (!bottomSectionImage && parsedBottom.image) bottomSection.image = parsedBottom.image;
        }
        event.bottomSection = bottomSection;


        // Update Collections
        // This is complex because we match by index or ID. 
        // Simplest strategy: Replace collections with new list, 
        // using correctly mapped images (either new uploads or existing URLs).

        // The frontend should send `collections` as a JSON array of objects.
        // Each object has { title, subtitle, images: [url, url...] }
        // For new uploads, we have `collectionImages_${index}`.

        // We will reconstruct the collections array.
        const newCollections = collections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImageUrls = colFiles.map(f => f.path);

            // Existing images should be passed in 'images' array in the JSON object from frontend
            // We combine them.
            const existingImages = col.images || [];

            return {
                title: col.title,
                subtitle: col.subtitle,
                images: [...existingImages, ...newImageUrls]
            };
        });

        event.collections = newCollections;

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);

    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Failed to update event", error: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Failed to delete event", error: error.message });
    }
};

// Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
};

// Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event", error: error.message });
    }
};
