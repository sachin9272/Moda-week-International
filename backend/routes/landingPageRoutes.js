import express from "express";
import { getLandingPage, updateLandingPage } from "../controllers/landingPageController.js";
import { setFolder, uploadS3 } from "../config/s3Config.js";
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", optionalProtectAndAuthorize('landing_page', 'view'), getLandingPage);
router.put(
    "/",
    protect,
    authorizePermission('landing_page', 'edit'),
    setFolder("landing-page"),
    uploadS3.fields([{ name: "modaIntroImage", maxCount: 1 }]),
    updateLandingPage
);

export default router;
