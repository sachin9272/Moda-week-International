import express from 'express';
import { getHero, updateHero } from '../controllers/participantsHeroController.js';
import { uploadS3 } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalProtectAndAuthorize('participants_hero', 'view'), getHero);
router.put('/', protect, authorizePermission('participants_hero', 'edit'), uploadS3.none(), updateHero); // Using none() since we aren't uploading files currently

export default router;
