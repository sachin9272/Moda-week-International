import express from 'express';
import { getHero, updateHero } from '../controllers/pastEventHeroController.js';
import { uploadS3 } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalProtectAndAuthorize('past_event_hero', 'view'), getHero);
// Using none() as file uploads are removed from requirements for these headers
router.put('/', protect, authorizePermission('past_event_hero', 'edit'), uploadS3.none(), updateHero);

export default router;
