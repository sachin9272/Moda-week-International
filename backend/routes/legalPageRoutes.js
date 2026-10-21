import express from 'express';
import { getLegalPage, updateLegalPage } from '../controllers/legalPageController.js';
import { protect, authorizePermission, optionalProtectAndAuthorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:type', optionalProtectAndAuthorize('legal_pages', 'view'), getLegalPage);
router.put('/:type', protect, authorizePermission('legal_pages', 'edit'), updateLegalPage);

export default router;
