import express from 'express';
import { createTeamMember, getTeamMembers, deleteTeamMember, updateTeamMember, getTeamMemberCountries, getTeamMemberById, reorderTeamMembers } from '../controllers/productionTeamController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/countries', optionalProtectAndAuthorize('production_team', 'view'), getTeamMemberCountries);
router.put('/reorder', protect, authorizePermission('production_team', 'edit'), reorderTeamMembers);
router.post('/', protect, authorizePermission('production_team', 'create'), setFolder('production-team'), uploadS3.single('image'), createTeamMember);
router.put('/:id', protect, authorizePermission('production_team', 'edit'), setFolder('production-team'), uploadS3.single('image'), updateTeamMember);
router.get('/:id', optionalProtectAndAuthorize('production_team', 'view'), getTeamMemberById);
router.get('/', optionalProtectAndAuthorize('production_team', 'view'), getTeamMembers);
router.delete('/:id', protect, authorizePermission('production_team', 'delete'), deleteTeamMember);

export default router;
