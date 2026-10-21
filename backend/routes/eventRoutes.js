import express from 'express';
const router = express.Router();
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, updateEventStatus, reorderEvents } from '../controllers/eventController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

router.post('/create', protect, authorizePermission('events', 'create'), setFolder('events'), uploadS3.any(), createEvent);
router.get('/all', optionalProtectAndAuthorize('events', 'view'), getEvents);
router.put('/reorder', protect, authorizePermission('events', 'edit'), reorderEvents);
router.get('/:id', optionalProtectAndAuthorize('events', 'view'), getEventById);
router.put('/update/:id', protect, authorizePermission('events', 'edit'), setFolder('events'), uploadS3.any(), updateEvent);
router.patch('/update-status/:id', protect, authorizePermission('events', 'edit'), updateEventStatus);
router.delete('/delete/:id', protect, authorizePermission('events', 'delete'), deleteEvent);

export default router;
