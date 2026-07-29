import express from 'express';
const router = express.Router();
import {
    getServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType
} from '../controllers/serviceTypeController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

router.get('/', getServiceTypes);
router.post('/', setFolder('service-types'), uploadS3.single('image'), createServiceType);
router.put('/:id', setFolder('service-types'), uploadS3.single('image'), updateServiceType);
router.delete('/:id', deleteServiceType);

export default router;
