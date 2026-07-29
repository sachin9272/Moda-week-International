import express from "express";
import { getRsvpPage, updateRsvpPage } from "../controllers/rsvpPageController.js";
import { setFolder, uploadS3 } from "../config/s3Config.js";

const router = express.Router();

router.get("/", getRsvpPage);
router.put(
  "/",
  setFolder("rsvp-page"),
  uploadS3.fields([
    { name: "galaImage", maxCount: 1 },
    { name: "seatingImage", maxCount: 1 },
  ]),
  updateRsvpPage
);

export default router;
