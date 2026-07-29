import express from 'express';
import { createMediaMember, getMediaMembers, deleteMediaMember, updateMediaMember, getMediaMemberCountries, getMediaMemberById } from '../controllers/pressAndMediaController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

router.get('/countries', getMediaMemberCountries);
router.post('/', setFolder('press-and-media'), uploadS3.single('image'), createMediaMember);
router.put('/:id', setFolder('press-and-media'), uploadS3.single('image'), updateMediaMember);
router.get('/:id', getMediaMemberById);
router.get('/', getMediaMembers);
router.delete('/:id', deleteMediaMember);

export default router;
