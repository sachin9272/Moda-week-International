import express from 'express';
const router = express.Router();
import {
    getServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType
} from '../controllers/serviceTypeController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

router.get('/', optionalProtectAndAuthorize('services_content', 'view'), getServiceTypes);
router.post('/', protect, authorizePermission('services_content', 'create'), setFolder('service-types'), uploadS3.single('image'), createServiceType);
router.put('/:id', protect, authorizePermission('services_content', 'edit'), setFolder('service-types'), uploadS3.single('image'), updateServiceType);
router.delete('/:id', protect, authorizePermission('services_content', 'delete'), deleteServiceType);

export default router;
