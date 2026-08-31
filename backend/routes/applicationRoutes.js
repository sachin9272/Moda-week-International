import express from 'express';
import {
    createBuyerApplication,
    createDesignerApplication,
    createSponsorApplication,
    createServiceApplication,
    createRsvpApplication
} from '../controllers/applicationController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

router.post('/buyer', createBuyerApplication);
router.post('/designer', createDesignerApplication);
router.post('/sponsor', createSponsorApplication);
router.post('/service', setFolder('press-media-applications'), uploadS3.single('photo'), createServiceApplication);
router.post('/rsvp', createRsvpApplication);

export default router;
