import express from "express";
import { updateDonationPage, getDonationPage } from "../controllers/donationPageController.js";
import { uploadS3, setFolder } from "../config/s3Config.js";
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", optionalProtectAndAuthorize('philanthropy_donation', 'view'), getDonationPage);
router.put("/",
    protect,
    authorizePermission('philanthropy_donation', 'edit'),
    setFolder('donation/slideshow'),
    uploadS3.fields([{ name: 'slideshowImages', maxCount: 10 }]),
    updateDonationPage
);

export default router;
