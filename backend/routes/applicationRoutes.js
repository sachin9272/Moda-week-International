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
router.post('/service', setFolder('service-applications'), uploadS3.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'compCard', maxCount: 1 },
    { name: 'digitals', maxCount: 1 },
    { name: 'brandLogo', maxCount: 1 },
    { name: 'mediaKit', maxCount: 1 },
    { name: 'lookbook', maxCount: 1 },
    { name: 'membershipLogo', maxCount: 1 },
    { name: 'pressKit', maxCount: 1 },
]), createServiceApplication);
router.post('/rsvp', createRsvpApplication);

export default router;
