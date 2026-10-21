import express from 'express';
import { getPhilanthropy, updatePhilanthropy } from '../controllers/philanthropyController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalProtectAndAuthorize('philanthropy_donation', 'view'), getPhilanthropy);

router.post('/update', protect, authorizePermission('philanthropy_donation', 'edit'), setFolder('philanthropy'), uploadS3.fields([
    { name: 'sectionImage_community', maxCount: 1 },
    { name: 'sectionImage_events', maxCount: 1 },
    { name: 'sectionImage_digital', maxCount: 1 },
    { name: 'sectionVideo_events', maxCount: 1 }, // Assuming video is for events section primarily
    { name: 'slideshowImages', maxCount: 10 }
]), updatePhilanthropy);

export default router;
