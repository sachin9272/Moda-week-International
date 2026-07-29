import express from 'express';
const router = express.Router();
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, updateEventStatus } from '../controllers/eventController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

router.post('/create', setFolder('events'), uploadS3.any(), createEvent);
router.get('/all', getEvents);
router.put('/reorder', reorderEvents);
router.get('/:id', getEventById);
router.put('/update/:id', setFolder('events'), uploadS3.any(), updateEvent);
router.patch('/update-status/:id', updateEventStatus);
router.delete('/delete/:id', deleteEvent);

export default router;
