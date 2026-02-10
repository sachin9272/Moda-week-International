import express from "express";
import { updateDonationPage, getDonationPage } from "../controllers/donationPageController.js";
import { uploadCloudinary, setFolder } from "../config/cloudinaryConfig.js";

const router = express.Router();

router.get("/", getDonationPage);
router.put("/",
    setFolder('donation/slideshow'),
    uploadCloudinary.fields([{ name: 'slideshowImages', maxCount: 10 }]),
    updateDonationPage
);

export default router;
