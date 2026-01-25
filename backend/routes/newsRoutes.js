import express from 'express';
import { getAllNews, getLiveNews, getNews, submitUserNews, getPendingNews, approveNews, rejectNews } from '../controllers/newsController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

// Public News Routes (No Auth Required)
router.get('/', getAllNews);
router.get('/live', getLiveNews);

// User Submission Route (Public - with image upload)
router.post('/submit', uploadCloudinary.single('image'), submitUserNews);

// Admin Routes for Pending Submissions
router.get('/pending', getPendingNews);
router.patch('/:id/approve', approveNews);
router.delete('/:id/reject', rejectNews);

router.get('/:id', getNews);

export default router;
