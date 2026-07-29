import express from 'express';
import { getHero, updateHero } from '../controllers/pastEventHeroController.js';
import { uploadS3 } from '../config/s3Config.js';

const router = express.Router();

router.get('/', getHero);
// Using none() as file uploads are removed from requirements for these headers
router.put('/', uploadS3.none(), updateHero);

export default router;
