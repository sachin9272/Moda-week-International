import express from 'express';
import { getAllNews, getNews, createNews, updateNews, deleteNews } from '../controllers/newsController.js';
import {
    getDashboardStats,
    getAllBuyers, deleteBuyer, bulkDeleteBuyers,
    getAllDesigners, deleteDesigner, bulkDeleteDesigners,
    getAllSponsors, deleteSponsor, bulkDeleteSponsors,
    getAllServices, deleteService, bulkDeleteServices, updateServiceStatus,
    getAllRsvps, deleteRsvp, bulkDeleteRsvps,
    loginAdmin, registerAdmin
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

// Auth Routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Dashboard Stats
router.get('/stats', protect, getDashboardStats);

// Application Routes
router.get('/buyers', protect, getAllBuyers);
router.post('/buyers/bulk-delete', protect, bulkDeleteBuyers);
router.delete('/buyers/:id', protect, deleteBuyer);

router.get('/designers', protect, getAllDesigners);
router.post('/designers/bulk-delete', protect, bulkDeleteDesigners);
router.delete('/designers/:id', protect, deleteDesigner);

router.get('/sponsors', protect, getAllSponsors);
router.post('/sponsors/bulk-delete', protect, bulkDeleteSponsors);
router.delete('/sponsors/:id', protect, deleteSponsor);

router.get('/services', protect, getAllServices);
router.post('/services/bulk-delete', protect, bulkDeleteServices);
router.delete('/services/:id', protect, deleteService);
router.put('/services/:id/status', protect, updateServiceStatus);
router.get('/rsvps', protect, getAllRsvps);
router.post('/rsvps/bulk-delete', protect, bulkDeleteRsvps);
router.delete('/rsvps/:id', protect, deleteRsvp);

// News Routes
router.get('/news/get-all', protect, getAllNews);
router.get('/news/get/:id', protect, getNews);
router.post('/news/create', protect, setFolder('news'), uploadS3.single('image'), createNews);
router.put('/news/update/:id', protect, setFolder('news'), uploadS3.single('image'), updateNews);
router.delete('/news/delete/:id', protect, deleteNews);

// Export the router
export default router;
