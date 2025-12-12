import express from 'express';
import { getAllNews, getNews, createNews, updateNews, deleteNews } from '../controllers/newsController.js';
import {
    getDashboardStats,
    getAllBuyers, deleteBuyer,
    getAllDesigners, deleteDesigner,
    getAllSponsors, deleteSponsor,
    getAllServices, deleteService,
    loginAdmin, registerAdmin
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
import multer from "multer";
const upload = multer();

// Auth Routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Dashboard Stats
router.get('/stats', protect, getDashboardStats);

// Application Routes
router.get('/buyers', protect, getAllBuyers);
router.delete('/buyers/:id', protect, deleteBuyer);

router.get('/designers', protect, getAllDesigners);
router.delete('/designers/:id', protect, deleteDesigner);

router.get('/sponsors', protect, getAllSponsors);
router.delete('/sponsors/:id', protect, deleteSponsor);

router.get('/services', protect, getAllServices);
router.delete('/services/:id', protect, deleteService);

// News Routes
router.get('/news/get-all', protect, getAllNews);
router.get('/news/get/:id', protect, getNews);
router.post('/news/create', protect, upload.none(), createNews);
router.put('/news/update/:id', protect, updateNews);
router.delete('/news/delete/:id', protect, deleteNews);

// Export the router
export default router;