import express from 'express';
import { getAllNews, getLiveNews, getNews, getNewsBySlug, submitUserNews, getPendingNews, approveNews, rejectNews } from '../controllers/newsController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

const router = express.Router();

// Public News Routes (No Auth Required)
router.get('/', getAllNews);
router.get('/live', getLiveNews);
router.get('/slug/:slug', getNewsBySlug); // Fetch by slug for SEO friendly URLs

// User Submission Route (Public - with image and video upload)
router.post('/submit', setFolder('news'), uploadCloudinary.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), submitUserNews);

// Admin Routes for Pending Submissions
router.get('/pending', getPendingNews);
router.patch('/:id/approve', approveNews);
router.delete('/:id/reject', rejectNews);

router.get('/:id', getNews);

export default router;
