import express from "express";
import { getLandingPage, updateLandingPage } from "../controllers/landingPageController.js";
import { setFolder, uploadCloudinary } from "../config/cloudinaryConfig.js";

const router = express.Router();

router.get("/", getLandingPage);
router.put(
    "/",
    setFolder("landing-page"),
    uploadCloudinary.fields([{ name: "modaIntroImage", maxCount: 1 }]),
    updateLandingPage
);

export default router;
