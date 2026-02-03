import express from 'express';
const router = express.Router();
import { createUpcomingEvent, getUpcomingEvents, getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent } from '../controllers/upcomingEventController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

router.post('/create', setFolder('upcoming-events'), uploadCloudinary.any(), createUpcomingEvent);
router.get('/all', getUpcomingEvents);
router.get('/:id', getUpcomingEventById);
router.put('/update/:id', setFolder('upcoming-events'), uploadCloudinary.any(), updateUpcomingEvent);
router.delete('/delete/:id', deleteUpcomingEvent);

export default router;
