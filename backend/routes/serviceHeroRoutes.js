import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/serviceHeroController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

router.get('/', getHero);
router.put('/', setFolder('services/hero'), uploadCloudinary.single('image'), updateHero);

export default router;

