import express from "express";
import { createPartner, getAllPartners, deletePartner } from "../controllers/partnerController.js";
import { uploadS3, setFolder } from "../config/s3Config.js";
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.get("/", optionalProtectAndAuthorize('partners', 'view'), getAllPartners);
router.post("/", protect, authorizePermission('partners', 'create'), setFolder('partners'), uploadS3.single("image"), createPartner);
router.delete("/:id", protect, authorizePermission('partners', 'delete'), deletePartner);

export default router;
