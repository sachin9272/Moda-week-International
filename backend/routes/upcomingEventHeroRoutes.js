import express from 'express';
import { getHero, updateHero } from '../controllers/upcomingEventHeroController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalProtectAndAuthorize('upcoming_event_hero', 'view'), getHero);
router.put('/', protect, authorizePermission('upcoming_event_hero', 'edit'), setFolder('upcoming-events/hero'), uploadS3.single('image'), updateHero);

export default router;
