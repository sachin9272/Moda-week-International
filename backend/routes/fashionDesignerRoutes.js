import express from 'express';
import { createDesigner, getDesigners, deleteDesigner } from '../controllers/fashionDesignerController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.post('/', uploadCloudinary.single('image'), createDesigner);
router.get('/', getDesigners);
router.delete('/:id', deleteDesigner);

export default router;
