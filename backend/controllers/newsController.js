import News from '../models/newsModel.js';
import { deleteCloudinaryAsset } from '../utils/cloudinaryHelper.js';
import { createNotification } from './notificationController.js';
import slugify from 'slugify';

const generateSlug = async (title) => {
    let slug = slugify(title, { lower: true, strict: true });
    let exists = await News.findOne({ slug });
    let counter = 1;
    while (exists) {
        const newSlug = `${slug}-${counter}`;
        exists = await News.findOne({ slug: newSlug });
        if (!exists) {
            slug = newSlug;
        }
        counter++;
    }
    return slug;
};

// Get all news articles (Admin) - with pagination & filtering
export const getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const { category, status } = req.query;

        let query = { status: { $ne: 'pending' } }; // Default: exclude pending

        if (category && category !== 'ALL') {
            query.category = category;
        }

        if (status && status !== 'ALL') {
            query.status = status;
        }

        const total = await News.countDocuments(query);
        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            data: news,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get only live news articles with pagination, filtering, and search
export const getLiveNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const { category, search } = req.query;

        let query = { status: 'live' };

        if (category && category !== 'ALL POSTS') {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const total = await News.countDocuments(query);
        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            data: news,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
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

// Get news by slug
export const getNewsBySlug = async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.slug });
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
            slug: await generateSlug(title),
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

        if (req.body.title) {
            const oldNews = await News.findById(req.params.id);
            if (oldNews && oldNews.title !== req.body.title) {
                updateData.slug = await generateSlug(req.body.title);
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

// Submit news from user (pending approval)
export const submitUserNews = async (req, res) => {
    console.log("User News Submission Body------->", req.body);
    console.log("User News Submission Files------->", req.files);
    const {
        title, content, category, author, submitterName, submitterEmail,
        mediaCompany, position, officialWebsite, articleLink, authorProfileLink
    } = req.body;

    let imageData = {};
    if (req.files && req.files['image']) {
        const file = req.files['image'][0];
        imageData = {
            url: file.path,
            public_id: file.filename
        };
    }

    let videoData = {};
    if (req.files && req.files['video']) {
        const file = req.files['video'][0];
        videoData = {
            url: file.path,
            public_id: file.filename
        };
    }

    try {
        const news = await News.create({
            title,
            content,
            category,
            slug: await generateSlug(title),
            author: author || submitterName || 'Anonymous',
            status: 'pending',
            image: imageData,
            video: videoData,
            submittedBy: {
                name: submitterName,
                email: submitterEmail
            },
            mediaCompany,
            position,
            officialWebsite,
            articleLink,
            authorProfileLink
        });

        // Create notification for admin
        await createNotification({
            type: 'editorial_submission',
            title: 'New Editorial Submission',
            message: `${submitterName || 'Someone'} has applied for an editorial`,
            link: '/news?tab=pending',
            relatedId: news._id,
            relatedModel: 'News'
        });

        res.status(201).json({
            status: 'success',
            message: 'Your article has been submitted for review',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get all pending news articles (for admin)
export const getPendingNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const total = await News.countDocuments({ status: 'pending' });
        const news = await News.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            data: news,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Approve pending news (change status to live)
export const approveNews = async (req, res) => {
    try {
        const now = new Date();
        const news = await News.findByIdAndUpdate(
            req.params.id,
            {
                status: 'live',
                date: now.toISOString().split('T')[0],
                createdAt: now  // Update createdAt so it appears at top of list
            },
            { new: true }
        );
        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Article approved and published',
            data: news
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Reject pending news (delete it)
export const rejectNews = async (req, res) => {
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

        res.status(200).json({
            status: 'success',
            message: 'Article rejected and removed'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};