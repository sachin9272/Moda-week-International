import express from 'express';
const router = express.Router();
import { getVideos, addVideo, deleteVideo, updateVideo, reorderVideos } from '../controllers/landingVideoController.js';
import { uploadS3Video, setFolder } from '../config/s3Config.js';

router.get('/', getVideos);
router.post('/', setFolder('landing-videos'), uploadS3Video.single('video'), addVideo);
router.put('/reorder', reorderVideos);  // Must be before /:id route
router.put('/:id', setFolder('landing-videos'), uploadS3Video.single('video'), updateVideo);
router.delete('/:id', deleteVideo);

export default router;
