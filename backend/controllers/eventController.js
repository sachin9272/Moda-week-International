import Event from '../models/eventModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// Create a new event
// Create a new event
// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { city, eventName, date, eventType, heroLayout } = req.body;

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

        let descriptionSection = { isVisible: false };
        if (req.body.descriptionSection) {
            try {
                descriptionSection = JSON.parse(req.body.descriptionSection);
            } catch (e) {
                console.error("Error parsing descriptionSection JSON:", e);
            }
        }

        const files = req.files || [];

        // Helper to get file object
        const getFile = (fieldname) => {
            const file = files.find(f => f.fieldname === fieldname);
            return file ? { url: file.path, publicId: file.filename } : null;
        };

        const thumbnail = getFile('thumbnail');
        const headerVideo = getFile('headerVideo');
        const bottomSectionImage = getFile('bottomSectionImage');

        if (bottomSectionImage) {
            bottomSection.image = bottomSectionImage;
        }

        const collectionsWithImages = collections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImages = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            return {
                ...col,
                images: newImages,
                gridAspectRatio: col.gridAspectRatio || 'portrait'
            };
        });

        // Map Ticket Images
        let ticketsWithImages = [];
        if (req.body.tickets) {
            let parsedTickets = [];
            try {
                parsedTickets = JSON.parse(req.body.tickets);
            } catch (e) {
                console.error("Error parsing tickets", e);
            }

            ticketsWithImages = parsedTickets.map((ticket, index) => {
                const ticketFile = files.find(f => f.fieldname === `ticketImage_${index}`);
                return {
                    image: ticketFile ? { url: ticketFile.path, publicId: ticketFile.filename } : null
                };
            });
        }

        const newEvent = new Event({
            city,
            eventName,
            date,
            eventType: eventType || 'upcoming',
            thumbnail: thumbnail, // Now an object
            headerVideo: headerVideo, // Now an object
            heroLayout: heroLayout || 'split',
            heroGradient: req.body.heroGradient || 'none',
            collections: collectionsWithImages,
            bottomSection,
            descriptionSection,
            hasTickets: req.body.hasTickets === 'true',
            tickets: ticketsWithImages,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        // If error, we should ideally delete uploaded files from cloudinary to avoid orphans.
        // For now, simple error response.
        res.status(500).json({ message: "Failed to create event", error: error.message });
    }
};

// Helper to delete asset
const deleteAsset = async (publicId, type = 'image') => {
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: type });
        } catch (e) {
            console.error(`Failed to delete asset ${publicId}:`, e);
        }
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, eventName, date, eventType, heroLayout } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Normalize legacy string data for thumbnail/headerVideo to prevent validation errors
        if (event.thumbnail && typeof event.thumbnail === 'string') {
            const url = event.thumbnail;
            let publicId = undefined;
            try {
                const parts = url.split('/upload/');
                if (parts.length > 1) {
                    const withoutVersion = parts[1].replace(/^v\d+\//, '');
                    publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                }
            } catch (e) { }
            event.thumbnail = { url, publicId };
        }

        if (event.headerVideo && typeof event.headerVideo === 'string') {
            const url = event.headerVideo;
            let publicId = undefined;
            try {
                const parts = url.split('/upload/');
                if (parts.length > 1) {
                    const withoutVersion = parts[1].replace(/^v\d+\//, '');
                    publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                }
            } catch (e) { }
            event.headerVideo = { url, publicId };
        }

        const files = req.files || [];
        const getFile = (fieldname) => {
            const file = files.find(f => f.fieldname === fieldname);
            return file ? { url: file.path, publicId: file.filename } : null;
        };

        // 1. Identify kept images to avoid deletion
        const keptImageUrls = new Set();

        let incomingCollections = [];
        if (req.body.collections) {
            try {
                incomingCollections = JSON.parse(req.body.collections);
                // Collect all kept URLs
                incomingCollections.forEach(c => {
                    if (c.images) c.images.forEach(imgUrl => {
                        if (typeof imgUrl === 'string') keptImageUrls.add(imgUrl);
                    });
                });
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }
        }

        let incomingTickets = [];
        if (req.body.tickets) {
            try {
                incomingTickets = JSON.parse(req.body.tickets);
                incomingTickets.forEach(t => {
                    if (t.image && typeof t.image === 'string') keptImageUrls.add(t.image);
                    // Note: Frontend sends string if keeping, but object structure might differ. 
                    // Usually frontend just sends the URL string if it's an existing image.
                    // If t.image is an object {url...}, we need to extract url. check logic.
                    // EditEvent sends: image: ticketFile ? ... : ticket.image. 
                    // If ticket.image was an object {url, publicId}, it sends that object?
                    // Frontend 'EditEvent' for tickets handles images? 
                    // Looking at EditEvent logic (not fully visible but implied): usually it sends back what it got.
                    // If we change model to Object, 'ticket.image' is Object. 
                    // We need to handle this:
                    if (t.image && t.image.url) keptImageUrls.add(t.image.url);
                });
            } catch (e) { }
        }

        // 2. Handle Thumbnail
        const thumbnailFile = getFile('thumbnail');
        if (thumbnailFile) {
            // New uploaded, delete old
            if (event.thumbnail && event.thumbnail.publicId) {
                await deleteAsset(event.thumbnail.publicId, 'image');
            }
            event.thumbnail = thumbnailFile;
        }

        // 3. Handle Header Video
        const headerVideoFile = getFile('headerVideo');
        if (headerVideoFile) {
            if (event.headerVideo && event.headerVideo.publicId) {
                await deleteAsset(event.headerVideo.publicId, 'video');
            }
            event.headerVideo = headerVideoFile;
        }

        // 4. Handle Collections (Delete removed images)
        if (event.collections) {
            for (const col of event.collections) {
                if (col.images) {
                    for (const img of col.images) {
                        // Check if this existing image URL is present in the `keptImageUrls`
                        // If NOT, delete it from Cloudinary
                        // Also, we need check if it has a publicId
                        if (img.url && !keptImageUrls.has(img.url) && img.publicId) {
                            await deleteAsset(img.publicId, 'image');
                        }
                    }
                }
            }
        }

        // Reconstruct Collections
        const newCollections = incomingCollections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImagesParts = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            // Existing images: The frontend sends an array of URLs (strings).
            // We need to convert these strings back to the full Object {url, publicId} from the DB.
            // But finding them is inefficient if we just search everything.
            // Better: We can filter the CURRENT event's images to find matches.

            // Helper to reconstruct url from character map object
            const getSafeImage = (img) => {
                if (!img) return null;

                // Convert Mongoose doc to plain object if needed
                let plainImg = img;
                if (img.toObject && typeof img.toObject === 'function') {
                    plainImg = img.toObject();
                }

                // If it's a proper object with url
                if (plainImg.url && typeof plainImg.url === 'string') return plainImg;

                // If it's the corrupted character map (numeric keys)
                // We check if it has keys "0", "1", "2"...
                if (typeof plainImg === 'object' && '0' in plainImg && '1' in plainImg) {
                    // Reconstruct string
                    try {
                        const sortedKeys = Object.keys(plainImg).filter(k => !isNaN(k)).sort((a, b) => parseInt(a) - parseInt(b));
                        const url = sortedKeys.map(k => plainImg[k]).join('');

                        const parts = url.split('/upload/');
                        let publicId = undefined;
                        if (parts.length > 1) {
                            const afterUpload = parts[1];
                            // remove version if present (v123123/)
                            const withoutVersion = afterUpload.replace(/^v\d+\//, '');
                            // remove extension
                            publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                        }
                        console.log("Reconstructed corrupted image:", url);
                        return { url, publicId };
                    } catch (e) {
                        console.error("Failed to reconstruct corrupted image", e);
                        return null;
                    }
                }
                return null;
            };

            const existingImagesObjects = [];
            if (col.images) {
                col.images.forEach(urlStr => {
                    // Find this URL in the OLD event data
                    let found = null;
                    if (event.collections) {
                        event.collections.forEach(oldCol => {
                            if (oldCol.images) {
                                const match = oldCol.images.find(oldImg => {
                                    const safeImg = getSafeImage(oldImg);
                                    return safeImg && safeImg.url === urlStr;
                                });
                                if (match) {
                                    // Use the SAFE image (reconstructed), not the original corrupted one if it was corrupted
                                    found = getSafeImage(match);
                                }
                            }
                        });
                    }
                    if (found) {
                        existingImagesObjects.push(found);
                    } else {
                        console.log("Warning: Could not find existing image match for:", urlStr);
                    }
                });
            }

            return {
                title: col.title,
                subtitle: col.subtitle,
                layout: col.layout,
                gridAspectRatio: col.gridAspectRatio || 'portrait',
                images: [...existingImagesObjects, ...newImagesParts]
            };
        });

        event.collections = newCollections;


        // 5. Handle Bottom Section
        const bottomSectionFile = getFile('bottomSectionImage');
        let bottomSection = {};
        if (req.body.bottomSection) bottomSection = JSON.parse(req.body.bottomSection);

        // If new file
        if (bottomSectionFile) {
            if (event.bottomSection?.image?.publicId) await deleteAsset(event.bottomSection.image.publicId, 'image');
            bottomSection.image = bottomSectionFile;
        } else {
            // If keeping existing, we need to ensure we keep the Object structure if it was there.
            // Frontend sends `image: urlString`. 
            if (bottomSection.image && typeof bottomSection.image === 'string') {
                if (event.bottomSection?.image?.url === bottomSection.image) {
                    bottomSection.image = event.bottomSection.image; // Keep the object
                } else {
                    // Match failed or event.bottomSection.image was missing/different
                    // Convert string to object to avoid CastError
                    bottomSection.image = { url: bottomSection.image };
                    // Try to recover publicId if possible
                    try {
                        const parts = bottomSection.image.url.split('/upload/');
                        if (parts.length > 1) {
                            const withoutVersion = parts[1].replace(/^v\d+\//, '');
                            bottomSection.image.publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                        }
                    } catch (e) { }
                }
            }
        }
        event.bottomSection = {
            title: bottomSection.title,
            text: bottomSection.text,
            image: bottomSection.image
        };


        // 6. Handle Tickets
        // (Simplified: Delete old tickets if not kept? Logic similar to collections but simpler list)
        // For ticket updates, if new file is uploaded, we replace.
        // If removed... tickets list is replaced.

        // Check removed tickets
        if (event.tickets) {
            event.tickets.forEach(ticket => {
                if (ticket.image && ticket.image.url && ticket.image.publicId) {
                    // Check if url is kept
                    // It's checked via `keptImageUrls` gathered from `incomingTickets`?
                    // Wait, incomingTickets logic above added to `keptImageUrls`.
                    if (!keptImageUrls.has(ticket.image.url)) {
                        deleteAsset(ticket.image.publicId, 'image');
                    }
                }
            });
        }

        // Reconstruct tickets
        const newTickets = incomingTickets.map((ticket, index) => {
            const ticketFile = files.find(f => f.fieldname === `ticketImage_${index}`);
            if (ticketFile) {
                return { image: { url: ticketFile.path, publicId: ticketFile.filename } };
            } else {
                // Existing. URL string passed?
                // Find original object
                let found = event.tickets.find(t => t.image && t.image.url === ticket.image || t.image === ticket.image);
                // If frontend sent object? handled. If string? found.
                if (ticket.image && typeof ticket.image === 'object' && ticket.image.url) {
                    // Frontend sent the object back?
                    return ticket;
                }
                return found || { image: null };
            }
        });
        event.tickets = newTickets;


        // Basic fields
        if (city) event.city = city;
        if (eventName) event.eventName = eventName;
        if (date) event.date = date;
        if (eventType) event.eventType = eventType;
        if (heroLayout) event.heroLayout = heroLayout;
        if (req.body.heroGradient) event.heroGradient = req.body.heroGradient;
        if (req.body.descriptionSection) {
            try {
                event.descriptionSection = JSON.parse(req.body.descriptionSection);
            } catch (e) { }
        }
        if (req.body.hasTickets !== undefined) event.hasTickets = req.body.hasTickets === 'true';

        const updatedEvent = await event.save({ validateBeforeSave: false });
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
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete all assets
        if (event.thumbnail?.publicId) await deleteAsset(event.thumbnail.publicId, 'image');
        if (event.headerVideo?.publicId) await deleteAsset(event.headerVideo.publicId, 'video');
        if (event.bottomSection?.image?.publicId) await deleteAsset(event.bottomSection.image.publicId, 'image');

        if (event.collections) {
            for (const col of event.collections) {
                if (col.images) {
                    for (const img of col.images) {
                        if (img.publicId) await deleteAsset(img.publicId, 'image');
                    }
                }
            }
        }

        if (event.tickets) {
            for (const ticket of event.tickets) {
                if (ticket.image?.publicId) await deleteAsset(ticket.image.publicId, 'image');
            }
        }

        await Event.findByIdAndDelete(id);

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Failed to delete event", error: error.message });
    }
};

// Get all events
export const getEvents = async (req, res) => {
    try {
        console.log("Fetching events...");
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
