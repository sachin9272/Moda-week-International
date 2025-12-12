import ServiceType from '../models/ServiceType.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// @desc    Get all service types
// @route   GET /api/service-types
// @access  Public
export const getServiceTypes = async (req, res) => {
    try {
        const services = await ServiceType.find().sort({ order: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a service type
// @route   POST /api/service-types
// @access  Private (Admin)
export const createServiceType = async (req, res) => {
    try {
        const { title, description, order } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const newService = new ServiceType({
            title,
            description,
            image: req.file.path,
            publicId: req.file.filename,
            order
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a service type
// @route   PUT /api/service-types/:id
// @access  Private (Admin)
export const updateServiceType = async (req, res) => {
    try {
        const { title, description, order } = req.body;
        const service = await ServiceType.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        service.title = title || service.title;
        service.description = description || service.description;
        service.order = order || service.order;

        if (req.file) {
            // Delete old image from Cloudinary
            if (service.publicId) {
                await cloudinary.uploader.destroy(service.publicId);
            }

            service.image = req.file.path;
            service.publicId = req.file.filename;
        }

        const updatedService = await service.save();
        res.json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a service type
// @route   DELETE /api/service-types/:id
// @access  Private (Admin)
export const deleteServiceType = async (req, res) => {
    try {
        const service = await ServiceType.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.publicId) {
            await cloudinary.uploader.destroy(service.publicId);
        }

        await service.deleteOne();
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
