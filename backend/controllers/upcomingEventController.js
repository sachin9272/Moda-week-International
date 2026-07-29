import UpcomingEvent from '../models/upcomingEventModel.js';
import { deleteS3Asset } from '../utils/s3Helper.js';
import slugify from 'slugify';

const generateUpcomingEventSlug = (title = '') =>
    slugify(
        title
            .replace(/[|/\\]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
        { lower: true, strict: true }
    ).replace(/-/g, '');

const syncUpcomingEventSlug = async (event) => {
    if (!event?.title) {
        return event;
    }

    const expectedSlug = generateUpcomingEventSlug(event.title);
    if (expectedSlug && event.slug !== expectedSlug) {
        event.slug = expectedSlug;
        await event.save();
    }

    return event;
};

const syncUpcomingEventSlugs = async (events = []) =>
    Promise.all(events.map((event) => syncUpcomingEventSlug(event)));

const getSafeImage = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return { url: img };
    if (img.url) return { url: img.url, publicId: img.publicId };
    return null;
};

const normalizeCollectionDay = (collection = {}) => {
    const normalizedDay = collection.day === 'custom'
        ? 'custom'
        : (['1', '2', '3', '4', '5'].includes(String(collection.day || '')) ? String(collection.day) : undefined);

    return {
        ...collection,
        day: normalizedDay,
        dayLabel: normalizedDay === 'custom' ? (collection.dayLabel || '').trim() : ''
    };
};

// Create a new upcoming event
export const createUpcomingEvent = async (req, res) => {
    try {
        const { title, eventName, eventDate, eventTime, location, dressCode, description, status, hasTickets, heroLayout, showOnLandingPage } = req.body;

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
        const ticketBannerImageFile = files.find(f => f.fieldname === 'ticketBannerImage');
        const ticketBannerImage = ticketBannerImageFile ? { url: ticketBannerImageFile.path, publicId: ticketBannerImageFile.filename } : null;

        // Process description section
        let descriptionSection = {};
        if (req.body.descriptionSection) {
             try {
                 descriptionSection = JSON.parse(req.body.descriptionSection);
             } catch(e) { console.error("Error parsing descriptionSection JSON:", e); }
        }
        const descImageFile = files.find(f => f.fieldname === 'descriptionSectionImage');
        if (descImageFile) {
             descriptionSection.image = { url: descImageFile.path, publicId: descImageFile.filename };
        }

        // Process video section
        let videoSection = {};
        if (req.body.videoSection) {
            try {
                videoSection = JSON.parse(req.body.videoSection);
            } catch(e) { console.error("Error parsing videoSection JSON:", e); }
        }
        const videoSectionFile = files.find(f => f.fieldname === 'videoSectionFile');
        if (videoSectionFile) {
             videoSection.url = videoSectionFile.path;
             videoSection.publicId = videoSectionFile.filename;
        }

        // Process partners
        let partnersMeta = [];
        if (req.body.partners) {
             try { partnersMeta = JSON.parse(req.body.partners); } catch(e) { console.error("Error parsing partners JSON:", e); }
        }
        const partners = partnersMeta.map((_, index) => {
             const partnerFile = files.find(f => f.fieldname === `partnerImage_${index}`);
             return partnerFile ? { url: partnerFile.path, publicId: partnerFile.filename } : null;
        }).filter(Boolean);

        // Process ticket images
        ticketTypes = ticketTypes.map((ticket, index) => {
             const ticketFile = files.find(f => f.fieldname === `ticketImage_${index}`);
             if (ticketFile) {
                 return { ...ticket, image: { url: ticketFile.path, publicId: ticketFile.filename } };
             }
             return ticket;
        });

        let collections = [];
        if (req.body.collections) {
            try {
                collections = JSON.parse(req.body.collections);
            } catch (e) {
                console.error("Error parsing collections JSON:", e);
            }
        }

        const collectionsWithImages = collections.map((col, index) => {
            const normalizedCol = normalizeCollectionDay(col);
            const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
            const newImages = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

            const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
            const designerImage = designerImageFile
                ? { url: designerImageFile.path, publicId: designerImageFile.filename }
                : getSafeImage(normalizedCol.designerImage);

            return {
                ...normalizedCol,
                images: [
                    ...(Array.isArray(normalizedCol.images) ? normalizedCol.images.map((img) => getSafeImage(img)).filter(Boolean) : []),
                    ...newImages
                ],
                designerImage,
                gridAspectRatio: normalizedCol.gridAspectRatio || 'portrait'
            };
        });

        const slug = generateUpcomingEventSlug(title);
        const newEvent = new UpcomingEvent({
            title,
            eventName: eventName?.trim() || '',
            slug,
            eventDate,
            eventTime: eventTime?.trim() || '',
            location,
            dressCode: dressCode?.trim() || '',
            description,
            status: status || 'hidden',
            showOnLandingPage: showOnLandingPage === 'true' || showOnLandingPage === true,
            heroLayout: heroLayout || 'split',
            coverImage,
            ticketBannerImage,
            hasTickets: hasTickets === 'true' || hasTickets === true,
            ticketTypes,
            collections: collectionsWithImages,
            descriptionSection,
            videoSection,
            partners
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
        const { status, showOnLandingPage } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (showOnLandingPage !== undefined) {
            query.showOnLandingPage = showOnLandingPage === 'true';
        }

        const events = await UpcomingEvent.find(query).sort({ order: 1, createdAt: -1 });
        await syncUpcomingEventSlugs(events);
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ message: "Failed to fetch upcoming events", error: error.message });
    }
};

// Reorder upcoming events
export const reorderUpcomingEvents = async (req, res) => {
    try {
        const { orders } = req.body;

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ message: 'Orders array is required' });
        }

        await Promise.all(
            orders.map(({ id, order }) =>
                UpcomingEvent.findByIdAndUpdate(id, { order }, { new: false })
            )
        );

        const events = await UpcomingEvent.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error reordering upcoming events:", error);
        res.status(500).json({ message: "Failed to reorder upcoming events", error: error.message });
    }
};

// Get single upcoming event by ID
export const getUpcomingEventById = async (req, res) => {
    try {
        const { id } = req.params;
        let event;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            event = await UpcomingEvent.findById(id);
        }

        if (!event) {
            event = await UpcomingEvent.findOne({ slug: id });
            if (!event) {
                const eventsBySlug = await UpcomingEvent.find({ $or: [{ slug: { $exists: true } }, { title: { $exists: true } }] });
                event = eventsBySlug.find((e) => {
                    const storedSlug = e.slug ? e.slug.replace(/-/g, '') : '';
                    const generatedSlug = generateUpcomingEventSlug(e.title);
                    return storedSlug === id || generatedSlug === id;
                });
            }
        }

        if (!event) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        await syncUpcomingEventSlug(event);
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
        const { title, eventName, eventDate, eventTime, location, dressCode, description, hasTickets, showOnLandingPage } = req.body;

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
        const ticketBannerImageFile = files.find(f => f.fieldname === 'ticketBannerImage');

        // Handle Cover Image
        if (coverImageFile) {
            if (event.coverImage && event.coverImage.publicId) {
                await deleteS3Asset(event.coverImage.publicId, 'image');
            }
            event.coverImage = { url: coverImageFile.path, publicId: coverImageFile.filename };
        } else if (req.body.removeCoverImage === 'true') {
            if (event.coverImage && event.coverImage.publicId) {
                await deleteS3Asset(event.coverImage.publicId, 'image');
            }
            event.coverImage = null;
        }

        if (ticketBannerImageFile) {
            if (event.ticketBannerImage && event.ticketBannerImage.publicId) {
                await deleteS3Asset(event.ticketBannerImage.publicId, 'image');
            }
            event.ticketBannerImage = { url: ticketBannerImageFile.path, publicId: ticketBannerImageFile.filename };
        } else if (req.body.removeTicketBannerImage === 'true') {
            if (event.ticketBannerImage && event.ticketBannerImage.publicId) {
                await deleteS3Asset(event.ticketBannerImage.publicId, 'image');
            }
            event.ticketBannerImage = null;
        }

        // Handle description section updates
        const previousDescriptionImage = getSafeImage(event.descriptionSection?.image);
        if (req.body.descriptionSection) {
            try {
                const parsedDesc = JSON.parse(req.body.descriptionSection);
                event.descriptionSection = {
                    ...event.descriptionSection,
                    ...parsedDesc,
                    image: parsedDesc.removeImage ? null : previousDescriptionImage
                };
            } catch(e) { console.error("Error parsing descriptionSection JSON:", e); }
        }
        const descImageFile = files.find(f => f.fieldname === 'descriptionSectionImage');
        if (descImageFile) {
            if (event.descriptionSection && event.descriptionSection.image && event.descriptionSection.image.publicId) {
                await deleteS3Asset(event.descriptionSection.image.publicId, 'image');
            }
            event.descriptionSection = { ...event.descriptionSection, image: { url: descImageFile.path, publicId: descImageFile.filename } };
        } else if (event.descriptionSection?.image === null) {
            if (previousDescriptionImage?.publicId) {
                await deleteS3Asset(previousDescriptionImage.publicId, 'image');
            }
            event.descriptionSection = { ...event.descriptionSection, image: null };
        }

        // Handle video section updates
        if (req.body.videoSection) {
            try {
                const parsedVideo = JSON.parse(req.body.videoSection);
                const previousVideoPublicId = event.videoSection?.publicId;
                event.videoSection = {
                    ...event.videoSection,
                    ...parsedVideo,
                    url: parsedVideo.type === 'youtube' ? parsedVideo.url : event.videoSection?.url,
                    publicId: parsedVideo.type === 'youtube' ? null : event.videoSection?.publicId,
                };

                if (parsedVideo.type === 'youtube' && previousVideoPublicId) {
                    await deleteS3Asset(previousVideoPublicId, 'video');
                }
            } catch(e) { console.error("Error parsing videoSection JSON:", e); }
        }
        const videoSectionFile = files.find(f => f.fieldname === 'videoSectionFile');
        if (videoSectionFile) {
            if (event.videoSection && event.videoSection.publicId) {
                await deleteS3Asset(event.videoSection.publicId, 'video');
            }
            if (!event.videoSection) event.videoSection = {};
            event.videoSection.url = videoSectionFile.path;
            event.videoSection.publicId = videoSectionFile.filename;
        }

        // Handle partners updates
        if (req.body.partners) {
             try {
                const partnersMeta = JSON.parse(req.body.partners);
                const keptPartners = new Set();
                partnersMeta.forEach(pm => {
                     // Since old partners don't have ID, we rely on the URL sent back to identify kept ones if applicable.
                     // A safer way is checking what is sent. Currently, standard approach is:
                     if (pm.url) keptPartners.add(pm.url);
                });

                // Cleanup deleted
                if (event.partners) {
                    for (const p of event.partners) {
                        if (p.publicId && !keptPartners.has(p.url)) {
                             await deleteS3Asset(p.publicId, 'image');
                        }
                    }
                }

                const existingPartnersObjects = [];
                if (event.partners) {
                    event.partners.forEach(oldP => {
                         if (keptPartners.has(oldP.url)) existingPartnersObjects.push(oldP);
                    });
                }

                // New partners
                const newPartners = [];
                partnersMeta.forEach((_, index) => {
                     const f = files.find(f => f.fieldname === `partnerImage_${index}`);
                     if (f) newPartners.push({ url: f.path, publicId: f.filename });
                });

                event.partners = [...existingPartnersObjects, ...newPartners];
             } catch(e) { console.error("Error parsing partners JSON:", e); }
        }

        // Handle tickets updates
        if (req.body.ticketTypes) {
             const keptTicketImages = new Set();
             ticketTypes.forEach(t => {
                 if (t.image && typeof t.image === 'string') keptTicketImages.add(t.image);
                 else if (t.image && t.image.url) keptTicketImages.add(t.image.url);
             });

             if (event.ticketTypes) {
                 for (const t of event.ticketTypes) {
                     if (t.image && t.image.publicId && !keptTicketImages.has(t.image.url)) {
                          await deleteS3Asset(t.image.publicId, 'image');
                     }
                 }
             }

             const newTicketTypes = ticketTypes.map((t, index) => {
                const f = files.find(f => f.fieldname === `ticketImage_${index}`);
                let finalImage = null;
                if (f) {
                    finalImage = { url: f.path, publicId: f.filename };
                } else if (t.image) {
                    const imgUrl = typeof t.image === 'string' ? t.image : t.image.url;
                    let foundImg = null;
                    if (event.ticketTypes) {
                         event.ticketTypes.forEach(oldT => {
                              if (oldT.image && oldT.image.url === imgUrl) foundImg = oldT.image;
                         });
                    }
                    finalImage = foundImg || (typeof t.image === 'string' ? { url: t.image } : t.image);
                }
                return { ...t, image: finalImage };
             });
             event.ticketTypes = newTicketTypes;
        }
        // Note: If no new file and no "remove" flag, we assume keeping existing is default behavior unless explicitly cleared? 
        // Usually FormData won't send the file field if not changed. 
        // If we want to allow removing the image without replacing, we'd need a flag or empty value logic. 
        // For now, assume if not sent, keep existing.

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
                                await deleteS3Asset(img.publicId, 'image');
                            }
                        }
                    }
                    if (col.designerImage && col.designerImage.publicId) {
                        if (!keptImageUrls.has(col.designerImage.url)) {
                            await deleteS3Asset(col.designerImage.publicId, 'image');
                        }
                    }
                }
            }

            // Map new collections
            const newCollections = incomingCollections.map((col, index) => {
                const normalizedCol = normalizeCollectionDay(col);
                const colFiles = files.filter(f => f.fieldname === `collectionImages_${index}`);
                const newImagesParts = colFiles.map(f => ({ url: f.path, publicId: f.filename }));

                const designerImageFile = files.find(f => f.fieldname === `collectionDesignerImage_${index}`);
                let designerImage = null;

                if (designerImageFile) {
                    designerImage = { url: designerImageFile.path, publicId: designerImageFile.filename };
                } else if (normalizedCol.designerImage) {
                    const diUrl = typeof normalizedCol.designerImage === 'string' ? normalizedCol.designerImage : normalizedCol.designerImage.url;
                    let foundDI = null;
                    if (event.collections) {
                        event.collections.forEach(oldCol => {
                            const safeDI = getSafeImage(oldCol.designerImage);
                            if (safeDI && safeDI.url === diUrl) foundDI = safeDI;
                        });
                    }
                    designerImage = foundDI || (typeof normalizedCol.designerImage === 'string' ? { url: normalizedCol.designerImage } : normalizedCol.designerImage);
                }

                const existingImagesObjects = [];
                if (normalizedCol.images) {
                    normalizedCol.images.forEach(imgData => {
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
                    ...normalizedCol,
                    designerImage,
                    images: [...existingImagesObjects, ...newImagesParts]
                };
            });
            event.collections = newCollections;
        }


        if (title !== undefined) {
            event.title = title;
            event.slug = generateUpcomingEventSlug(title);
        }
        if (eventName !== undefined) event.eventName = eventName.trim();
        if (eventDate !== undefined) event.eventDate = eventDate;
        if (eventTime !== undefined) event.eventTime = eventTime.trim();
        if (location !== undefined) event.location = location;
        if (dressCode !== undefined) event.dressCode = dressCode.trim();
        if (description !== undefined) event.description = description;
        if (req.body.status) event.status = req.body.status;
        if (showOnLandingPage !== undefined) {
            event.showOnLandingPage = showOnLandingPage === 'true' || showOnLandingPage === true;
        }
        if (req.body.heroLayout) event.heroLayout = req.body.heroLayout;
        if (req.body.hasTickets !== undefined) event.hasTickets = (hasTickets === 'true' || hasTickets === true);

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
            await deleteS3Asset(event.coverImage.publicId, 'image');
        }
        if (event.ticketBannerImage && event.ticketBannerImage.publicId) {
            await deleteS3Asset(event.ticketBannerImage.publicId, 'image');
        }

        if (event.descriptionSection && event.descriptionSection.image && event.descriptionSection.image.publicId) {
            await deleteS3Asset(event.descriptionSection.image.publicId, 'image');
        }

        if (event.videoSection && event.videoSection.publicId) {
            await deleteS3Asset(event.videoSection.publicId, 'video');
        }

        if (event.partners) {
            for (const p of event.partners) {
                 if (p.publicId) await deleteS3Asset(p.publicId, 'image');
            }
        }

        if (event.ticketTypes) {
            for (const t of event.ticketTypes) {
                 if (t.image && t.image.publicId) await deleteS3Asset(t.image.publicId, 'image');
            }
        }

        if (event.collections) {
            for (const col of event.collections) {
                if (col.images) {
                    for (const img of col.images) {
                        if (img && img.publicId) await deleteS3Asset(img.publicId, 'image');
                    }
                }
                if (col.designerImage && col.designerImage.publicId) {
                    await deleteS3Asset(col.designerImage.publicId, 'image');
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
