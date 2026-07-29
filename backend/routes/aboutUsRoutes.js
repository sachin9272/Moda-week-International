import express from "express";
import { updateAboutUs, getAboutUs } from "../controllers/aboutUsController.js";
import { uploadS3, setFolder } from "../config/s3Config.js";

const router = express.Router();

// Generate fields for dynamic cards (up to 20 cards supported)
const cardFields = Array.from({ length: 100 }, (_, i) => ({ name: `globalPlatformCardImage_${i}`, maxCount: 1 }));

const uploadFields = [
    { name: 'mainSectionImage', maxCount: 1 },
    { name: 'foundationSectionImage', maxCount: 1 },
    { name: 'philosophySectionImage', maxCount: 1 },
    ...cardFields
];

router.get("/", getAboutUs);
router.put("/",
    setFolder('about-us'),
    uploadS3.fields(uploadFields),
    updateAboutUs
);

export default router;
