import express from 'express';
import { getAllNews, getLiveNews, getNews } from '../controllers/newsController.js';

const router = express.Router();

// Public News Routes (No Auth Required)
router.get('/', getAllNews);
router.get('/live', getLiveNews);
router.get('/:id', getNews);

export default router;
