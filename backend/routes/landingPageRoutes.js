import express from "express";
import { getLandingPage, updateLandingPage } from "../controllers/landingPageController.js";
import { setFolder, uploadS3 } from "../config/s3Config.js";

const router = express.Router();

router.get("/", getLandingPage);
router.put(
    "/",
    setFolder("landing-page"),
    uploadS3.fields([{ name: "modaIntroImage", maxCount: 1 }]),
    updateLandingPage
);

export default router;
