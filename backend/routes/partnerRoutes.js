import express from "express";
import { createPartner, getAllPartners, deletePartner } from "../controllers/partnerController.js";

import { uploadS3, setFolder } from "../config/s3Config.js";

const router = express.Router();

// Routes
router.get("/", getAllPartners);
router.post("/", setFolder('partners'), uploadS3.single("image"), createPartner);
router.delete("/:id", deletePartner);

export default router;
