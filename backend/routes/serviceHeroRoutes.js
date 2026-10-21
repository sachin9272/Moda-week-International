import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/serviceHeroController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

router.get('/', optionalProtectAndAuthorize('services_content', 'view'), getHero);
router.put('/', protect, authorizePermission('services_content', 'edit'), setFolder('services/hero'), uploadS3.single('image'), updateHero);

export default router;

