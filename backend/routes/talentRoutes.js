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
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTalents)
    .post(protect, setFolder('talents'), uploadS3.single('image'), createTalent);

router.get('/countries', getTalentCountries);

router.route('/:id')
    .get(getTalentById)
    .put(protect, setFolder('talents'), uploadS3.single('image'), updateTalent)
    .delete(protect, deleteTalent);

export default router;
