import express from 'express';
import {
    createBuyerApplication,
    createDesignerApplication,
    createSponsorApplication,
    createServiceApplication
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/buyer', createBuyerApplication);
router.post('/designer', createDesignerApplication);
router.post('/sponsor', createSponsorApplication);
router.post('/service', createServiceApplication);

export default router;
