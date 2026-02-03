import express from 'express';
import { createDesigner, getDesigners, deleteDesigner, updateDesigner, getDesignerCountries, getDesignerById } from '../controllers/fashionDesignerController.js';
import { uploadCloudinary, setFolder } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/countries', getDesignerCountries);
router.post('/', setFolder('fashion-designers'), uploadCloudinary.single('image'), createDesigner);
router.put('/:id', setFolder('fashion-designers'), uploadCloudinary.single('image'), updateDesigner);
router.get('/:id', getDesignerById);
router.get('/', getDesigners);
router.delete('/:id', deleteDesigner);

export default router;
