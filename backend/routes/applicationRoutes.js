import express from 'express';
import {
    createBuyerApplication,
    createDesignerApplication,
    createSponsorApplication,
    createServiceApplication,
    createRsvpApplication
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/buyer', createBuyerApplication);
router.post('/designer', createDesignerApplication);
router.post('/sponsor', createSponsorApplication);
router.post('/service', createServiceApplication);
router.post('/rsvp', createRsvpApplication);

export default router;
