import express from 'express';
import { createDesigner, getDesigners, deleteDesigner, updateDesigner, getDesignerCountries } from '../controllers/fashionDesignerController.js';
import { uploadCloudinary } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/countries', getDesignerCountries);
router.post('/', uploadCloudinary.single('image'), createDesigner);
router.put('/:id', uploadCloudinary.single('image'), updateDesigner);
router.get('/', getDesigners);
router.delete('/:id', deleteDesigner);

export default router;
