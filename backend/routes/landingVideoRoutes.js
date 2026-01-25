import express from 'express';
const router = express.Router();
import { getVideos, addVideo, deleteVideo, updateVideo, reorderVideos } from '../controllers/landingVideoController.js';
import upload from '../config/multerConfig.js';

router.get('/', getVideos);
router.post('/', upload.single('video'), addVideo);
router.put('/reorder', reorderVideos);  // Must be before /:id route
router.put('/:id', upload.single('video'), updateVideo);
router.delete('/:id', deleteVideo);

export default router;
