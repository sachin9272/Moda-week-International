import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/serviceHeroController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

router.get('/', getHero);
router.put('/', setFolder('services/hero'), uploadS3.single('image'), updateHero);

export default router;

