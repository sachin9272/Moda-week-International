
import express from 'express';
import { getInstagramFollowers } from '../controllers/instagramController.js';

const router = express.Router();

router.get('/followers', getInstagramFollowers);

export default router;
