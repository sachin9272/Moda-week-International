import express from 'express';
const router = express.Router();
import { createUpcomingEvent, getUpcomingEvents, getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent, reorderUpcomingEvents } from '../controllers/upcomingEventController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

router.post('/create', protect, authorizePermission('events', 'create'), setFolder('upcoming-events'), uploadS3.any(), createUpcomingEvent);
router.get('/all', optionalProtectAndAuthorize('events', 'view'), getUpcomingEvents);
router.put('/reorder', protect, authorizePermission('events', 'edit'), reorderUpcomingEvents);
router.get('/:id', optionalProtectAndAuthorize('events', 'view'), getUpcomingEventById);
router.put('/update/:id', protect, authorizePermission('events', 'edit'), setFolder('upcoming-events'), uploadS3.any(), updateUpcomingEvent);
router.delete('/delete/:id', protect, authorizePermission('events', 'delete'), deleteUpcomingEvent);

export default router;
