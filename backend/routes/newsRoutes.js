import express from 'express';
import { getAllNews, getLiveNews, getNews, getNewsBySlug, submitUserNews, getPendingNews, approveNews, rejectNews } from '../controllers/newsController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

const router = express.Router();

// Public News Routes (No Auth Required)
router.get('/', getAllNews);
router.get('/live', getLiveNews);
router.get('/slug/:slug', getNewsBySlug); // Fetch by slug for SEO friendly URLs

// User Submission Route (Public - with image upload)
router.post('/submit', setFolder('news'), uploadCloudinary.single('image'), submitUserNews);

// Admin Routes for Pending Submissions
router.get('/pending', getPendingNews);
router.patch('/:id/approve', approveNews);
router.delete('/:id/reject', rejectNews);

router.get('/:id', getNews);

export default router;
