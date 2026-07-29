import express from 'express';
const router = express.Router();
import { createUpcomingEvent, getUpcomingEvents, getUpcomingEventById, updateUpcomingEvent, deleteUpcomingEvent, reorderUpcomingEvents } from '../controllers/upcomingEventController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

router.post('/create', setFolder('upcoming-events'), uploadS3.any(), createUpcomingEvent);
router.get('/all', getUpcomingEvents);
router.put('/reorder', reorderUpcomingEvents);
router.get('/:id', getUpcomingEventById);
router.put('/update/:id', setFolder('upcoming-events'), uploadS3.any(), updateUpcomingEvent);
router.delete('/delete/:id', deleteUpcomingEvent);

export default router;
