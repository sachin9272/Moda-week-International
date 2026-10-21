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
import { protect, protectScanner, authorizePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Scanner Endpoint
router.post('/login', loginScannerOperator);

// Private Scanner Endpoint (verify token)
router.get('/verify', protectScanner, verifyScannerToken);

// Admin Operator Management Endpoints (protected by protect admin middleware and granular RBAC)
router.route('/')
    .get(protect, authorizePermission('scanner_operators', 'view'), getScannerOperators)
    .post(protect, authorizePermission('scanner_operators', 'create'), createScannerOperator);

router.route('/:id')
    .delete(protect, authorizePermission('scanner_operators', 'delete'), deleteScannerOperator);

router.patch('/:id/toggle', protect, authorizePermission('scanner_operators', 'edit'), toggleScannerOperatorStatus);
router.patch('/:id/reset-password', protect, authorizePermission('scanner_operators', 'edit'), resetScannerOperatorPassword);

export default router;
