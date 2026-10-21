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
import { protect, authorizePermission } from '../middlewares/authMiddleware.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

// Auth Routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Current Admin Permissions
router.get('/my-permissions', protect, (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            id: req.admin._id,
            esmeraldaUserId: req.admin.esmeraldaUserId,
            name: req.admin.name || '',
            email: req.admin.email,
            role: req.admin.role,
            status: req.admin.status,
            permittedProjects: req.admin.permittedProjects,
            permissions: req.admin.modaPermissions || {}
        }
    });
});

// Dashboard Stats
router.get('/stats', protect, authorizePermission('dashboard', 'view'), getDashboardStats);

// Application Routes
router.get('/buyers', protect, authorizePermission('applications', 'view'), getAllBuyers);
router.post('/buyers/bulk-delete', protect, authorizePermission('applications', 'delete'), bulkDeleteBuyers);
router.delete('/buyers/:id', protect, authorizePermission('applications', 'delete'), deleteBuyer);

router.get('/designers', protect, authorizePermission('applications', 'view'), getAllDesigners);
router.post('/designers/bulk-delete', protect, authorizePermission('applications', 'delete'), bulkDeleteDesigners);
router.delete('/designers/:id', protect, authorizePermission('applications', 'delete'), deleteDesigner);

router.get('/sponsors', protect, authorizePermission('applications', 'view'), getAllSponsors);
router.post('/sponsors/bulk-delete', protect, authorizePermission('applications', 'delete'), bulkDeleteSponsors);
router.delete('/sponsors/:id', protect, authorizePermission('applications', 'delete'), deleteSponsor);

router.get('/services', protect, authorizePermission('applications', 'view'), getAllServices);
router.post('/services/bulk-delete', protect, authorizePermission('applications', 'delete'), bulkDeleteServices);
router.delete('/services/:id', protect, authorizePermission('applications', 'delete'), deleteService);
router.put('/services/:id/status', protect, authorizePermission('applications', 'edit'), updateServiceStatus);
router.get('/rsvps', protect, authorizePermission('applications', 'view'), getAllRsvps);
router.post('/rsvps/bulk-delete', protect, authorizePermission('applications', 'delete'), bulkDeleteRsvps);
router.delete('/rsvps/:id', protect, authorizePermission('applications', 'delete'), deleteRsvp);

// News Routes
router.get('/news/get-all', protect, authorizePermission('news', 'view'), getAllNews);
router.get('/news/get/:id', protect, authorizePermission('news', 'view'), getNews);
router.post('/news/create', protect, authorizePermission('news', 'create'), setFolder('news'), uploadS3.single('image'), createNews);
router.put('/news/update/:id', protect, authorizePermission('news', 'edit'), setFolder('news'), uploadS3.single('image'), updateNews);
router.delete('/news/delete/:id', protect, authorizePermission('news', 'delete'), deleteNews);

// Export the router
export default router;
