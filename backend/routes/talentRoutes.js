import express from 'express';
import {
    createTalent,
    getTalents,
    getTalentById,
    updateTalent,
    deleteTalent,
    getTalentCountries
} from '../controllers/talentController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(optionalProtectAndAuthorize('fashion_designers', 'view'), getTalents)
    .post(protect, authorizePermission('fashion_designers', 'create'), setFolder('talents'), uploadS3.single('image'), createTalent);

router.get('/countries', optionalProtectAndAuthorize('fashion_designers', 'view'), getTalentCountries);

router.route('/:id')
    .get(optionalProtectAndAuthorize('fashion_designers', 'view'), getTalentById)
    .put(protect, authorizePermission('fashion_designers', 'edit'), setFolder('talents'), uploadS3.single('image'), updateTalent)
    .delete(protect, authorizePermission('fashion_designers', 'delete'), deleteTalent);

export default router;
