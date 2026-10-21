import express from 'express';
import { createDesigner, getDesigners, deleteDesigner, updateDesigner, getDesignerCountries, getDesignerById } from '../controllers/fashionDesignerController.js';
import { uploadS3, setFolder } from '../config/s3Config.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/countries', optionalProtectAndAuthorize('fashion_designers', 'view'), getDesignerCountries);
router.post('/', protect, authorizePermission('fashion_designers', 'create'), setFolder('fashion-designers'), uploadS3.single('image'), createDesigner);
router.put('/:id', protect, authorizePermission('fashion_designers', 'edit'), setFolder('fashion-designers'), uploadS3.single('image'), updateDesigner);
router.get('/:id', optionalProtectAndAuthorize('fashion_designers', 'view'), getDesignerById);
router.get('/', optionalProtectAndAuthorize('fashion_designers', 'view'), getDesigners);
router.delete('/:id', protect, authorizePermission('fashion_designers', 'delete'), deleteDesigner);

export default router;
