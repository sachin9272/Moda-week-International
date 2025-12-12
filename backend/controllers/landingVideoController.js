import LandingVideo from '../models/LandingVideo.js';

// @desc    Get all landing videos
// @route   GET /api/landing-videos
// @access  Public
export const getVideos = async (req, res) => {
    try {
        const videos = await LandingVideo.find().sort({ order: 1 });
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
        const { title, order } = req.body;
        let videoUrl = req.body.videoUrl;

        if (req.file) {
            // If file is uploaded, set the path
            // Note: We're storing the relative path from the server root
            videoUrl = `/uploads/videos/${req.file.filename}`;
        }

        if (!videoUrl) {
            return res.status(400).json({ message: 'Please provide a video file or URL' });
        }

        const newVideo = new LandingVideo({
            title,
            videoUrl,
            order
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

        // Delete file from disk if it exists and is a local file
        if (video.videoUrl && video.videoUrl.startsWith('/uploads')) {
            // Construct absolute path. 
            // videoUrl is something like "/uploads/videos/filename.mp4"
            // We need to resolve this relative to the project root (backend folder)
            // __dirname is .../backend/controllers
            // We want .../backend/uploads/videos/...

            const filePath = path.join(__dirname, '..', video.videoUrl);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete video file:', err);
                    // Continue with DB deletion even if file deletion fails
                }
            });
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
        const { title, order } = req.body;
        const video = await LandingVideo.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.title = title || video.title;
        video.order = order || video.order;

        if (req.file) {
            // Delete old file if it exists locally
            if (video.videoUrl && video.videoUrl.startsWith('/uploads')) {
                const oldFilePath = path.join(__dirname, '..', video.videoUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Set new video URL
            video.videoUrl = `/uploads/videos/${req.file.filename}`;
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
