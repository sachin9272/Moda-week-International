import express from "express";
import { getRsvpPage, updateRsvpPage } from "../controllers/rsvpPageController.js";
import { setFolder, uploadS3 } from "../config/s3Config.js";
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", optionalProtectAndAuthorize('rsvp_page', 'view'), getRsvpPage);
router.put(
  "/",
  protect,
  authorizePermission('rsvp_page', 'edit'),
  setFolder("rsvp-page"),
  uploadS3.fields([
    { name: "galaImage", maxCount: 1 },
    { name: "seatingImage", maxCount: 1 },
  ]),
  updateRsvpPage
);

export default router;
