import express from 'express';
import { getAllNews, getLiveNews, getNews, getNewsBySlug, submitUserNews, getPendingNews, approveNews, rejectNews } from '../controllers/newsController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public News Routes (No Auth Required)
router.get('/', optionalProtectAndAuthorize('news', 'view'), getAllNews);
router.get('/live', getLiveNews);
router.get('/slug/:slug', getNewsBySlug); // Fetch by slug for SEO friendly URLs

// User Submission Route (Public - with image and video upload)
router.post('/submit', setFolder('news'), uploadS3.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), submitUserNews);

// Admin Routes for Pending Submissions
router.get('/pending', protect, authorizePermission('news', 'view'), getPendingNews);
router.patch('/:id/approve', protect, authorizePermission('news', 'edit'), approveNews);
router.delete('/:id/reject', protect, authorizePermission('news', 'delete'), rejectNews);

router.get('/:id', optionalProtectAndAuthorize('news', 'view'), getNews);

export default router;
