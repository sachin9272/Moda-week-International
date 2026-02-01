import express from 'express';
import { getHero, updateHero } from '../controllers/upcomingEventHeroController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', uploadCloudinary.single('image'), updateHero);

export default router;
