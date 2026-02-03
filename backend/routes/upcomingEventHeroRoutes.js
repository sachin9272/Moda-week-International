import express from 'express';
import { getHero, updateHero } from '../controllers/upcomingEventHeroController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', setFolder('upcoming-events/hero'), uploadCloudinary.single('image'), updateHero);

export default router;
