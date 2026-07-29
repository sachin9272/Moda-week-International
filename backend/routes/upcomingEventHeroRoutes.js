import express from 'express';
import { getHero, updateHero } from '../controllers/upcomingEventHeroController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', setFolder('upcoming-events/hero'), uploadS3.single('image'), updateHero);

export default router;
