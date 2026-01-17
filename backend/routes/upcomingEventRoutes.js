import express from 'express';
const router = express.Router();
import { createUpcomingEvent, getUpcomingEvents, getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent } from '../controllers/upcomingEventController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

router.post('/create', uploadCloudinary.any(), createUpcomingEvent);
router.get('/all', getUpcomingEvents);
router.get('/:id', getUpcomingEventById);
router.put('/update/:id', uploadCloudinary.any(), updateUpcomingEvent);
router.delete('/delete/:id', deleteUpcomingEvent);

export default router;
