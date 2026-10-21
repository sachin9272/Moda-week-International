import express from 'express';
const router = express.Router();
import { getVideos, addVideo, deleteVideo, updateVideo, reorderVideos } from '../controllers/landingVideoController.js';
import { uploadS3Video, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

router.get('/', optionalProtectAndAuthorize('landing_videos', 'view'), getVideos);
router.post('/', protect, authorizePermission('landing_videos', 'create'), setFolder('landing-videos'), uploadS3Video.single('video'), addVideo);
router.put('/reorder', protect, authorizePermission('landing_videos', 'edit'), reorderVideos);  // Must be before /:id route
router.put('/:id', protect, authorizePermission('landing_videos', 'edit'), setFolder('landing-videos'), uploadS3Video.single('video'), updateVideo);
router.delete('/:id', protect, authorizePermission('landing_videos', 'delete'), deleteVideo);

export default router;
