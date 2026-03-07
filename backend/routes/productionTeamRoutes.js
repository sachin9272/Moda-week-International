import express from 'express';
import { createTeamMember, getTeamMembers, deleteTeamMember, updateTeamMember, getTeamMemberCountries, getTeamMemberById } from '../controllers/productionTeamController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/countries', getTeamMemberCountries);
router.post('/', setFolder('production-team'), uploadCloudinary.single('image'), createTeamMember);
router.put('/:id', setFolder('production-team'), uploadCloudinary.single('image'), updateTeamMember);
router.get('/:id', getTeamMemberById);
router.get('/', getTeamMembers);
router.delete('/:id', deleteTeamMember);

export default router;
