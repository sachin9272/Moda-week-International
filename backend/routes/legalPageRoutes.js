import express from 'express';
import { getLegalPage, updateLegalPage } from '../controllers/legalPageController.js';

const router = express.Router();

router.get('/:type', getLegalPage);
router.put('/:type', updateLegalPage);

export default router;
