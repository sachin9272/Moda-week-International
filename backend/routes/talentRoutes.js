import express from 'express';
import {
    createTalent,
    getTalents,
    getTalentById,
    updateTalent,
    deleteTalent,
    getTalentCountries
} from '../controllers/talentController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTalents)
    .post(protect, uploadCloudinary.single('image'), createTalent);

router.get('/countries', getTalentCountries);

router.route('/:id')
    .get(getTalentById)
    .put(protect, uploadCloudinary.single('image'), updateTalent)
    .delete(protect, deleteTalent);

export default router;
