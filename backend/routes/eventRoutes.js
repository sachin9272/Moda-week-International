import express from 'express';
const router = express.Router();
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

router.post('/create', uploadCloudinary.any(), createEvent);
router.get('/all', getEvents);
router.get('/:id', getEventById);
router.put('/update/:id', uploadCloudinary.any(), updateEvent);
router.delete('/delete/:id', deleteEvent);

export default router;
