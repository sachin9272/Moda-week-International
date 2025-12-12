import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/serviceHeroController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

router.get('/', getHero);
router.put('/', uploadCloudinary.single('image'), updateHero);

export default router;

