import express from 'express';
import { getHero, updateHero } from '../controllers/participantsHeroController.js';
import { uploadS3 } from '../config/s3Config.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', uploadS3.none(), updateHero); // Using none() since we aren't uploading files currently

export default router;
