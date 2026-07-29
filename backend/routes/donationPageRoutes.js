import express from "express";
import { updateDonationPage, getDonationPage } from "../controllers/donationPageController.js";
import { uploadS3, setFolder } from "../config/s3Config.js";

const router = express.Router();

router.get("/", getDonationPage);
router.put("/",
    setFolder('donation/slideshow'),
    uploadS3.fields([{ name: 'slideshowImages', maxCount: 10 }]),
    updateDonationPage
);

export default router;
