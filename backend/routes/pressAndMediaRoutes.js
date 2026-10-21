import express from 'express';
import { createMediaMember, getMediaMembers, deleteMediaMember, updateMediaMember, getMediaMemberCountries, getMediaMemberById } from '../controllers/pressAndMediaController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/countries', optionalProtectAndAuthorize('press_media', 'view'), getMediaMemberCountries);
router.post('/', protect, authorizePermission('press_media', 'create'), setFolder('press-and-media'), uploadS3.single('image'), createMediaMember);
router.put('/:id', protect, authorizePermission('press_media', 'edit'), setFolder('press-and-media'), uploadS3.single('image'), updateMediaMember);
router.get('/:id', optionalProtectAndAuthorize('press_media', 'view'), getMediaMemberById);
router.get('/', optionalProtectAndAuthorize('press_media', 'view'), getMediaMembers);
router.delete('/:id', protect, authorizePermission('press_media', 'delete'), deleteMediaMember);

export default router;
