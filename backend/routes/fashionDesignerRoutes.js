import express from 'express';
import { createDesigner, getDesigners, deleteDesigner, updateDesigner, getDesignerCountries, getDesignerById } from '../controllers/fashionDesignerController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';

const router = express.Router();

router.get('/countries', getDesignerCountries);
router.post('/', setFolder('fashion-designers'), uploadS3.single('image'), createDesigner);
router.put('/:id', setFolder('fashion-designers'), uploadS3.single('image'), updateDesigner);
router.get('/:id', getDesignerById);
router.get('/', getDesigners);
router.delete('/:id', deleteDesigner);

export default router;
