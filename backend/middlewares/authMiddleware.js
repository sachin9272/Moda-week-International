import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import ScannerOperator from '../models/scannerOperatorModel.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.admin = await Admin.findById(decoded.id).select('-password');
            if (req.admin) {
                return next();
            }
            res.status(401).json({ success: false, message: 'Not authorized as admin' });
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const protectScanner = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const scanner = await ScannerOperator.findById(decoded.id).select('-password');
            if (scanner && scanner.isActive) {
                req.scannerOperator = scanner;
                return next();
            } else if (scanner && !scanner.isActive) {
                return res.status(403).json({ success: false, message: 'Account is deactivated' });
            }
            res.status(401).json({ success: false, message: 'Not authorized as scanner operator' });
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Combined protect that allows either admin or active scanner operator
export const protectAny = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check admin first
            const admin = await Admin.findById(decoded.id).select('-password');
            if (admin) {
                req.admin = admin;
                req.userType = 'admin';
                return next();
            }

            // Check scanner operator
            const scanner = await ScannerOperator.findById(decoded.id).select('-password');
            if (scanner) {
                if (!scanner.isActive) {
                    return res.status(403).json({ success: false, message: 'Account is deactivated' });
                }
                req.scannerOperator = scanner;
                req.userType = 'scanner';
                return next();
            }

            res.status(401).json({ success: false, message: 'Not authorized' });
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
