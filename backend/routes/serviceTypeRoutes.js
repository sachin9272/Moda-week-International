import express from 'express';
const router = express.Router();
import {
    getServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType
} from '../controllers/serviceTypeController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

router.get('/', getServiceTypes);
router.post('/', uploadCloudinary.single('image'), createServiceType);
router.put('/:id', uploadCloudinary.single('image'), updateServiceType);
router.delete('/:id', deleteServiceType);

export default router;
