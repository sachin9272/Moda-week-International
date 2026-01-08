import express from 'express';
import { getAllNews, getNews } from '../controllers/newsController.js';

const router = express.Router();

// Public News Routes
router.get('/', getAllNews);
router.get('/:id', getNews);

export default router;
