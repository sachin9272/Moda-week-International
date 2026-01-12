import Event from '../models/eventModel.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';


// Create a new event
// Create a new event
// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { city, eventName, date, eventType, heroLayout, status } = req.body;

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
        const descriptionSectionImage = getFile('descriptionSectionImage');

        if (bottomSectionImage) {
            bottomSection.image = bottomSectionImage;
        }

        if (descriptionSectionImage) {
            descriptionSection.image = descriptionSectionImage;
        }

        // Ensure imageSize defaults to medium if not present, and is included
        descriptionSection.imageSize = descriptionSection.imageSize || 'medium';



        // Handle Video Section
        const videoSectionFile = getFile('videoSectionFile');
        let videoSection = { type: 'youtube', isVisible: true, url: '' };
        if (req.body.videoSection) {
            try {
                const parsed = JSON.parse(req.body.videoSection);
                videoSection = { ...videoSection, ...parsed };
            } catch (e) {
                console.error("Error parsing videoSection JSON:", e);
            }
        }

        if (videoSection.type === 'upload' && videoSectionFile) {
            videoSection.url = videoSectionFile.url;
            videoSection.publicId = videoSectionFile.publicId;
        } else if (videoSection.type === 'youtube') {
            videoSection.publicId = undefined;
        }

        const collectionsWithImages = collections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImages = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
            const designerImage = designerImageFile ? { url: designerImageFile.path, publicId: designerImageFile.filename } : null;

            return {
                ...col,
                description: col.description,
                images: newImages,
                designerImage,
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
            collections: collectionsWithImages,
            descriptionSection,
            videoSection,
            hasTickets: req.body.hasTickets === 'true',
            tickets: ticketsWithImages,
            status: status || 'draft'
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



// Update an event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, eventName, date, eventType, heroLayout, status } = req.body;

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

        // Helper to reconstruct url from character map object
        const getSafeImage = (img) => {
            if (!img) return null;

            // Convert Mongoose doc to plain object if needed
            let plainImg = img;
            if (img.toObject && typeof img.toObject === 'function') {
                plainImg = img.toObject();
            }

            if (!plainImg) return null;

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

                    return { url, publicId };
                } catch (e) {
                    console.error("Failed to reconstruct corrupted image", e);
                    return null;
                }
            }
            return null;
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
                    // Also check for kept designerImage
                    if (c.designerImage && typeof c.designerImage === 'string') {
                        keptImageUrls.add(c.designerImage);
                    }
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
                await deleteCloudinaryAsset(event.thumbnail.publicId, 'image');
            }
            event.thumbnail = thumbnailFile;
        }

        // 3. Handle Header Video
        const headerVideoFile = getFile('headerVideo');
        if (req.body.removeHeaderVideo === 'true') {
            if (event.headerVideo && event.headerVideo.publicId) {
                await deleteCloudinaryAsset(event.headerVideo.publicId, 'video');
            }
            event.headerVideo = null;
        } else if (headerVideoFile) {
            if (event.headerVideo && event.headerVideo.publicId) {
                await deleteCloudinaryAsset(event.headerVideo.publicId, 'video');
            }
            event.headerVideo = headerVideoFile;
        }

        // 4. Handle Collections (Delete removed images)
        if (event.collections) {
            for (const col of event.collections) {
                if (!col) continue;
                // Delete removed collection images
                if (col.images) {
                    for (const img of col.images) {
                        if (img && img.url && !keptImageUrls.has(img.url) && img.publicId) {
                            await deleteCloudinaryAsset(img.publicId, 'image');
                        }
                    }
                }
                // Delete removed designerImage
                if (col.designerImage && col.designerImage.publicId) {
                    const diUrl = col.designerImage.url;
                    if (diUrl && !keptImageUrls.has(diUrl)) {
                        await deleteCloudinaryAsset(col.designerImage.publicId, 'image');
                    }
                }
            }
        }

        // Reconstruct Collections
        const newCollections = incomingCollections.map((col, index) => {
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImagesParts = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            // Handle Designer Image
            const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
            let designerImage = null;

            if (designerImageFile) {
                // New file uploaded
                designerImage = { url: designerImageFile.path, publicId: designerImageFile.filename };
            } else {
                // Check if kept
                if (col.designerImage && typeof col.designerImage === 'string') {
                    // Find matching old designer image
                    let foundDI = null;
                    if (event.collections) {
                        event.collections.forEach(oldCol => {
                            if (!oldCol) return;
                            const safeDI = getSafeImage(oldCol.designerImage);
                            if (safeDI && safeDI.url === col.designerImage) {
                                foundDI = safeDI;
                            }
                        });
                    }
                    designerImage = foundDI;
                } else if (col.designerImage && col.designerImage.url) {
                    designerImage = col.designerImage;
                }
            }

            // Existing images
            const existingImagesObjects = [];
            if (col.images) {
                col.images.forEach(urlStr => {
                    let found = null;
                    if (event.collections) {
                        event.collections.forEach(oldCol => {
                            if (!oldCol || !oldCol.images) return;
                            const match = oldCol.images.find(oldImg => {
                                const safeImg = getSafeImage(oldImg);
                                return safeImg && safeImg.url === urlStr;
                            });
                            if (match) {
                                found = getSafeImage(match);
                            }
                        });
                    }
                    if (found) {
                        existingImagesObjects.push(found);
                    }
                });
            }

            return {
                title: col.title,
                subtitle: col.subtitle,
                description: col.description,
                designerId: col.designerId,
                layout: col.layout,
                designerImage,
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
            if (event.bottomSection?.image?.publicId) await deleteCloudinaryAsset(event.bottomSection.image.publicId, 'image');
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
            credits: bottomSection.credits,
            image: bottomSection.image
        };

        // 5.5 Handle Description Section
        const descriptionSectionFile = getFile('descriptionSectionImage');
        let descriptionSection = { isVisible: false };
        if (req.body.descriptionSection) descriptionSection = JSON.parse(req.body.descriptionSection);



        // If new file
        if (descriptionSectionFile) {

            if (event.descriptionSection?.image?.publicId) await deleteCloudinaryAsset(event.descriptionSection.image.publicId, 'image');
            descriptionSection.image = descriptionSectionFile;
        } else {

            // If keeping existing
            if (descriptionSection.image && typeof descriptionSection.image === 'string') {


                if (event.descriptionSection?.image?.url === descriptionSection.image) {
                    descriptionSection.image = event.descriptionSection.image; // Keep the object
                } else {
                    descriptionSection.image = { url: descriptionSection.image };
                    try {
                        const parts = descriptionSection.image.url.split('/upload/');
                        if (parts.length > 1) {
                            const withoutVersion = parts[1].replace(/^v\d+\//, '');
                            descriptionSection.image.publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                        }
                    } catch (e) { }
                }
            } else if (!descriptionSection.image && event.descriptionSection?.image) {
                // Fallback: If no image sent in JSON and no new file, keep existing image
                // Fallback: If no image sent in JSON and no new file, keep existing image

                // STRICT CHECK: Only preserve if it has a URL
                if (event.descriptionSection.image && event.descriptionSection.image.url) {
                    descriptionSection.image = {
                        url: event.descriptionSection.image.url,
                        publicId: event.descriptionSection.image.publicId
                    };

                } else {

                    descriptionSection.image = undefined;
                }
            } else {

                descriptionSection.image = undefined;
            }
        }

        // Final sanity check before saving (to fix any lingering empty objects)
        if (descriptionSection.image && !descriptionSection.image.url && !descriptionSection.image.publicId) {

            descriptionSection.image = undefined;
        }


        if (!event.descriptionSection) event.descriptionSection = {};
        event.descriptionSection.title = descriptionSection.title;
        event.descriptionSection.text = descriptionSection.text;
        event.descriptionSection.credits = descriptionSection.credits;
        event.descriptionSection.isVisible = descriptionSection.isVisible;
        event.descriptionSection.imageSize = descriptionSection.imageSize || 'medium';

        if (descriptionSection.image && descriptionSection.image.url) {
            // Explicitly create a new object to ensure Mongoose treats it as a change
            event.descriptionSection.image = {
                url: descriptionSection.image.url,
                publicId: descriptionSection.image.publicId
            };
        } else {
            event.descriptionSection.image = undefined;
        }

        event.markModified('descriptionSection');
        event.markModified('descriptionSection.image'); // Explicitly mark image as modified


        // 5.6 Handle Video Section
        const videoSectionFile = getFile('videoSectionFile');
        let incomingVideoSection = { type: 'youtube', isVisible: true };
        if (req.body.videoSection) {
            try {
                incomingVideoSection = JSON.parse(req.body.videoSection);
            } catch (e) { }
        }

        // Initialize if not present
        if (!event.videoSection) event.videoSection = {};

        // Prepare new state
        event.videoSection.type = incomingVideoSection.type || 'youtube';
        event.videoSection.title = incomingVideoSection.title || '';
        event.videoSection.isVisible = incomingVideoSection.isVisible;

        if (event.videoSection.type === 'upload') {
            if (videoSectionFile) {
                // New file uploaded
                // Delete old if exists and was upload
                if (event.videoSection.publicId) {
                    await deleteCloudinaryAsset(event.videoSection.publicId, 'video');
                }
                event.videoSection.url = videoSectionFile.url;
                event.videoSection.publicId = videoSectionFile.publicId;
            } else {
                // No new file. Check if keeping existing.
                // If existing was youtube or didn't exist, and no file -> issue
                if (!event.videoSection.url && !incomingVideoSection.url) {
                    // Fallback or error? Just leave empty.
                }
                // If preserving existing upload, url is already there in event.videoSection.
                // But incoming might have the url string.
            }
        } else {
            // YouTube
            // If previously upload, delete asset
            if (event.videoSection.publicId) {
                await deleteCloudinaryAsset(event.videoSection.publicId, 'video');
                event.videoSection.publicId = undefined;
            }
            event.videoSection.url = incomingVideoSection.url;
        }
        event.markModified('videoSection');


        // 6. Handle Tickets
        // (Simplified: Delete old tickets if not kept? Logic similar to collections but simpler list)
        // For ticket updates, if new file is uploaded, we replace.
        // If removed... tickets list is replaced.

        // Check removed tickets
        if (event.tickets) {
            event.tickets.forEach(ticket => {
                if (ticket && ticket.image && ticket.image.url && ticket.image.publicId) {
                    // Check if url is kept
                    // It's checked via `keptImageUrls` gathered from `incomingTickets`?
                    // Wait, incomingTickets logic above added to `keptImageUrls`.
                    if (!keptImageUrls.has(ticket.image.url)) {
                        deleteCloudinaryAsset(ticket.image.publicId, 'image');
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
                let found = event.tickets ? event.tickets.find(t => t && (t.image && t.image.url === ticket.image || t.image === ticket.image)) : null;
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
        if (status) event.status = status;

        if (req.body.hasTickets !== undefined) event.hasTickets = req.body.hasTickets === 'true';

        const updatedEvent = await event.save({ validateBeforeSave: false });

        res.status(200).json(updatedEvent);

    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Failed to update event", error: error.message });
    }
};

// Update event status
export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error updating event status:", error);
        res.status(500).json({ message: "Failed to update event status", error: error.message });
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
        if (event.thumbnail?.publicId) await deleteCloudinaryAsset(event.thumbnail.publicId, 'image');
        if (event.headerVideo?.publicId) await deleteCloudinaryAsset(event.headerVideo.publicId, 'video');
        if (event.bottomSection?.image?.publicId) await deleteCloudinaryAsset(event.bottomSection.image.publicId, 'image');
        if (event.descriptionSection?.image?.publicId) await deleteCloudinaryAsset(event.descriptionSection.image.publicId, 'image');
        if (event.videoSection?.publicId) await deleteCloudinaryAsset(event.videoSection.publicId, 'video');

        if (event.collections) {
            for (const col of event.collections) {
                if (col.images) {
                    for (const img of col.images) {
                        if (img.publicId) await deleteCloudinaryAsset(img.publicId, 'image');
                    }
                }
                if (col.designerImage?.publicId) {
                    await deleteCloudinaryAsset(col.designerImage.publicId, 'image');
                }
            }
        }

        if (event.tickets) {
            for (const ticket of event.tickets) {
                if (ticket.image?.publicId) await deleteCloudinaryAsset(ticket.image.publicId, 'image');
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

        let query = {};

        // If status filter is requested
        if (req.query.status) {
            if (req.query.status === 'published') {
                // Return published events AND events with no status (backwards compatibility)
                query = {
                    $or: [
                        { status: 'published' },
                        { status: { $exists: false } },
                        { status: null }
                    ]
                };
            } else {
                query.status = req.query.status;
            }
        }

        const events = await Event.find(query).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
};

// Get single event by ID
// Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('collections.designerId');

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }



        // Convert to object to modify
        const eventObj = event.toObject();

        // Fallback Logic:
        // If collection.designerImage is missing, use collection.designerId.image
        if (eventObj.collections) {
            eventObj.collections = eventObj.collections.map(col => {
                if ((!col.designerImage || !col.designerImage.url) && col.designerId && col.designerId.image) {
                    col.designerImage = col.designerId.image;
                }

                // Also ensuring title/subtitle fallback if needed in future (optional)
                // For now, only image as requested.

                return col;
            });
        }

        res.status(200).json(eventObj);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event", error: error.message });
    }
};
