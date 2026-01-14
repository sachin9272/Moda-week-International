import News from '../models/newsModel.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';

// Get all news articles
export const getAllNews = async (req, res) => {
    try {
        const news = await News.find();
        res.status(200).json({
            status: 'success',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get only live news articles
export const getLiveNews = async (req, res) => {
    try {
        const news = await News.find({ status: 'live' });
        res.status(200).json({
            status: 'success',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get single news article
export const getNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Create new news article
export const createNews = async (req, res) => {
    console.log("Body------->", req.body);
    console.log("File------->", req.file);
    const { title, content, category, date, status, author } = req.body;

    let imageData = {};
    if (req.file) {
        imageData = {
            url: req.file.path,
            public_id: req.file.filename
        };
    }

    try {
        const news = await News.create({
            title,
            content,
            category,
            date,
            status: status || 'live',
            author: author || 'Admin',
            image: imageData
        });
        res.status(201).json({
            status: 'success',
            data: news
        });
    } catch (error) {
        // If DB creation fails but image uploaded, delete it? (Optional optimization)
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update news article
export const updateNews = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Handle Image Update
        if (req.file) {
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };

            // Delete old image if exists
            const oldNews = await News.findById(req.params.id);
            if (oldNews && oldNews.image && oldNews.image.public_id) {
                await deleteCloudinaryAsset(oldNews.image.public_id);
            }
        }

        const news = await News.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete news article
export const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found'
            });
        }

        // Delete image from Cloudinary
        if (news.image && news.image.public_id) {
            await deleteCloudinaryAsset(news.image.public_id);
        }

        await News.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};