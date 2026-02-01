import express from 'express';
import { getHero, updateHero } from '../controllers/participantsHeroController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', uploadCloudinary.none(), updateHero); // Using none() since we aren't uploading files currently

export default router;
