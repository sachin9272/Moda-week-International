import express from 'express';
const router = express.Router();
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, updateEventStatus, reorderEvents } from '../controllers/eventController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

router.post('/create', setFolder('events'), uploadCloudinary.any(), createEvent);
router.get('/all', getEvents);
router.put('/reorder', reorderEvents);
router.get('/:id', getEventById);
router.put('/update/:id', setFolder('events'), uploadCloudinary.any(), updateEvent);
router.patch('/update-status/:id', updateEventStatus);
router.delete('/delete/:id', deleteEvent);

export default router;
