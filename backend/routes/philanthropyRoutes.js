import express from 'express';
import { getPhilanthropy, updatePhilanthropy } from '../controllers/philanthropyController.js';
import multer from 'multer';

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage before Cloudinary

router.get('/', getPhilanthropy);

router.post('/update', upload.fields([
    { name: 'sectionImage_community', maxCount: 1 },
    { name: 'sectionImage_events', maxCount: 1 },
    { name: 'sectionImage_digital', maxCount: 1 },
    { name: 'sectionVideo_events', maxCount: 1 }, // Assuming video is for events section primarily
    { name: 'slideshowImages', maxCount: 10 }
]), updatePhilanthropy);

export default router;
