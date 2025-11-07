import News from '../models/newsModel.js';

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
    const { title, content, category, date } = req.body;
    try {
        const news = await News.create({ title, content, category, date, author: 'Admin' });
        res.status(201).json({
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

// Update news article
export const updateNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
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
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found'
            });
        }
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