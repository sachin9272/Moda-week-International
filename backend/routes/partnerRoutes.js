import express from "express";
import { createPartner, getAllPartners, deletePartner } from "../controllers/partnerController.js";

import { uploadCloudinary, setFolder } from "../config/cloudinaryConfig.js";

const router = express.Router();

// Routes
router.get("/", getAllPartners);
router.post("/", setFolder('partners'), uploadCloudinary.single("image"), createPartner);
router.delete("/:id", deletePartner);

export default router;
