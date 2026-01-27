import UpcomingEvent from '../models/upcomingEventModel.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';

// Create a new upcoming event
export const createUpcomingEvent = async (req, res) => {
    try {
        const { title, eventDate, location, description, status } = req.body;

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

        let collections = [];
        if (req.body.collections) {
            try {
                collections = JSON.parse(req.body.collections);
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }
        }

        const collectionsWithImages = collections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImages = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
            const designerImage = designerImageFile ? { url: designerImageFile.path, publicId: designerImageFile.filename } : null;

            return {
                ...col,
                images: newImages,
                designerImage,
                gridAspectRatio: col.gridAspectRatio || 'portrait'
            };
        });

        const newEvent = new UpcomingEvent({
            title,
            eventDate,
            location,
            description,
            status: status || 'hidden',
            coverImage,
            ticketTypes,
            collections: collectionsWithImages
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
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const events = await UpcomingEvent.find(query).sort({ createdAt: -1 });
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

        const getSafeImage = (img) => {
            if (!img) return null;
            if (typeof img === 'string') return { url: img };
            if (img.url) return { url: img.url, publicId: img.publicId };
            return null;
        };

        if (req.body.collections) {
            let incomingCollections = [];
            try {
                incomingCollections = JSON.parse(req.body.collections);
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }

            const keptImageUrls = new Set();
            incomingCollections.forEach(col => {
                if (col.images) {
                    col.images.forEach(img => {
                        if (typeof img === 'string') keptImageUrls.add(img);
                        else if (img.url) keptImageUrls.add(img.url);
                    });
                }
                if (col.designerImage) {
                    if (typeof col.designerImage === 'string') keptImageUrls.add(col.designerImage);
                    else if (col.designerImage.url) keptImageUrls.add(col.designerImage.url);
                }
            });

            // Cleanup removed assets
            if (event.collections) {
                for (const col of event.collections) {
                    if (col.images) {
                        for (const img of col.images) {
                            if (img && img.url && !keptImageUrls.has(img.url) && img.publicId) {
                                await deleteCloudinaryAsset(img.publicId, 'image');
                            }
                        }
                    }
                    if (col.designerImage && col.designerImage.publicId) {
                        if (!keptImageUrls.has(col.designerImage.url)) {
                            await deleteCloudinaryAsset(col.designerImage.publicId, 'image');
                        }
                    }
                }
            }

            // Map new collections
            const newCollections = incomingCollections.map((col, index) => {
                const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
                const newImagesParts = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

                const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
                let designerImage = null;

                if (designerImageFile) {
                    designerImage = { url: designerImageFile.path, publicId: designerImageFile.filename };
                } else if (col.designerImage) {
                    const diUrl = typeof col.designerImage === 'string' ? col.designerImage : col.designerImage.url;
                    let foundDI = null;
                    if (event.collections) {
                        event.collections.forEach(oldCol => {
                            const safeDI = getSafeImage(oldCol.designerImage);
                            if (safeDI && safeDI.url === diUrl) foundDI = safeDI;
                        });
                    }
                    designerImage = foundDI || (typeof col.designerImage === 'string' ? { url: col.designerImage } : col.designerImage);
                }

                const existingImagesObjects = [];
                if (col.images) {
                    col.images.forEach(imgData => {
                        const urlStr = typeof imgData === 'string' ? imgData : imgData.url;
                        let found = null;
                        if (event.collections) {
                            event.collections.forEach(oldCol => {
                                if (oldCol.images) {
                                    const match = oldCol.images.find(oldImg => {
                                        const safeImg = getSafeImage(oldImg);
                                        return safeImg && safeImg.url === urlStr;
                                    });
                                    if (match) found = getSafeImage(match);
                                }
                            });
                        }
                        if (found) existingImagesObjects.push(found);
                        else if (typeof imgData !== 'string') existingImagesObjects.push(imgData);
                    });
                }

                return {
                    ...col,
                    designerImage,
                    images: [...existingImagesObjects, ...newImagesParts]
                };
            });
            event.collections = newCollections;
        }

        if (title) event.title = title;
        if (eventDate) event.eventDate = eventDate;
        if (location) event.location = location;
        if (description) event.description = description;
        if (req.body.status) event.status = req.body.status;
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

        if (event.collections) {
            for (const col of event.collections) {
                if (col.images) {
                    for (const img of col.images) {
                        if (img && img.publicId) await deleteCloudinaryAsset(img.publicId, 'image');
                    }
                }
                if (col.designerImage && col.designerImage.publicId) {
                    await deleteCloudinaryAsset(col.designerImage.publicId, 'image');
                }
            }
        }

        await UpcomingEvent.findByIdAndDelete(id);

        res.status(200).json({ message: "Upcoming event deleted successfully" });
    } catch (error) {
        console.error("Error deleting upcoming event:", error);
        res.status(500).json({ message: "Failed to delete upcoming event", error: error.message });
    }
};
