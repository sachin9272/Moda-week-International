import express from 'express';
import { getHero, updateHero } from '../controllers/pastEventHeroController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getHero);
// Using none() as file uploads are removed from requirements for these headers
router.put('/', uploadCloudinary.none(), updateHero);

export default router;
