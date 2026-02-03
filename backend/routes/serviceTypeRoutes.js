import express from 'express';
const router = express.Router();
import {
    getServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType
} from '../controllers/serviceTypeController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

router.get('/', getServiceTypes);
router.post('/', setFolder('service-types'), uploadCloudinary.single('image'), createServiceType);
router.put('/:id', setFolder('service-types'), uploadCloudinary.single('image'), updateServiceType);
router.delete('/:id', deleteServiceType);

export default router;
