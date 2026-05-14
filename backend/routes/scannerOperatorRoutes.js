import express from 'express';
import {
    getScannerOperators,
    createScannerOperator,
    deleteScannerOperator,
    toggleScannerOperatorStatus,
    resetScannerOperatorPassword,
    loginScannerOperator,
    verifyScannerToken
} from '../controllers/scannerOperatorController.js';
import { protect, protectScanner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Scanner Endpoint
router.post('/login', loginScannerOperator);

// Private Scanner Endpoint (verify token)
router.get('/verify', protectScanner, verifyScannerToken);

// Admin Operator Management Endpoints (protected by protect admin middleware)
router.route('/')
    .get(protect, getScannerOperators)
    .post(protect, createScannerOperator);

router.route('/:id')
    .delete(protect, deleteScannerOperator);

router.patch('/:id/toggle', protect, toggleScannerOperatorStatus);
router.patch('/:id/reset-password', protect, resetScannerOperatorPassword);

export default router;
