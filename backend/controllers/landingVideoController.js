import LandingVideo from '../models/LandingVideo.js';
import { deleteS3Asset, extractS3Key } from '../utils/s3Helper.js';

// @desc    Get all landing videos
// @route   GET /api/landing-videos
// @access  Public
export const getVideos = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const videos = await LandingVideo.find(query).sort({ order: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new landing video
// @route   POST /api/landing-videos
// @access  Private (Admin)
export const addVideo = async (req, res) => {
    try {
        const { title, subtitle, order, type } = req.body;
        let videoUrl = req.body.videoUrl;

        if (req.file) {
            videoUrl = req.file.location;
        }

        if (!videoUrl) {
            return res.status(400).json({ message: 'Please provide a video file or URL' });
        }

        const newVideo = new LandingVideo({
            title,
            subtitle: subtitle || '',
            videoUrl,
            order,
            type: type || 'landing'
        });

        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Delete a landing video
// @route   DELETE /api/landing-videos/:id
// @access  Private (Admin)
export const deleteVideo = async (req, res) => {
    try {
        const video = await LandingVideo.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Delete the underlying file: legacy videos live on local disk, newer ones on S3
        if (video.videoUrl && video.videoUrl.startsWith('/uploads')) {
            const filePath = path.join(__dirname, '..', video.videoUrl);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete video file:', err);
                    // Continue with DB deletion even if file deletion fails
                }
            });
        } else if (video.videoUrl) {
            try {
                await deleteS3Asset(extractS3Key(video.videoUrl));
            } catch (err) {
                console.error('Failed to delete video from S3:', err);
                // Continue with DB deletion even if S3 deletion fails
            }
        }

        await video.deleteOne();
        res.json({ message: 'Video removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a landing video
// @route   PUT /api/landing-videos/:id
// @access  Private (Admin)
export const updateVideo = async (req, res) => {
    try {
        const { title, subtitle, order, type } = req.body;
        const video = await LandingVideo.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.title = title || video.title;
        if (subtitle !== undefined) video.subtitle = subtitle;
        video.order = order || video.order;
        if (type) video.type = type;

        if (req.file) {
            // Delete old video file: legacy videos live on local disk, newer ones on S3
            if (video.videoUrl && video.videoUrl.startsWith('/uploads')) {
                const oldFilePath = path.join(__dirname, '..', video.videoUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            } else if (video.videoUrl) {
                try {
                    await deleteS3Asset(extractS3Key(video.videoUrl));
                } catch (err) {
                    console.error('Failed to delete old video from S3:', err);
                }
            }

            // Set new video URL
            video.videoUrl = req.file.location;
        } else if (req.body.videoUrl) {
            // Fallback if they want to update URL manually
            video.videoUrl = req.body.videoUrl;
        }

        const updatedVideo = await video.save();
        res.json(updatedVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Bulk reorder landing videos
// @route   PUT /api/landing-videos/reorder
// @access  Private (Admin)
export const reorderVideos = async (req, res) => {
    try {
        const { orders } = req.body;

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ message: 'Orders array is required' });
        }

        // Update all videos in parallel
        const updatePromises = orders.map(({ id, order }) =>
            LandingVideo.findByIdAndUpdate(id, { order }, { new: true })
        );

        await Promise.all(updatePromises);

        // Return updated videos sorted by order
        const videos = await LandingVideo.find().sort({ order: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
