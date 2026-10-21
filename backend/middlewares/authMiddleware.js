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
            const jwtSecret = process.env.JWT_SECRET || 'thisisasercedtkeyformodaweekinternationalwhichissercure';
            const decoded = jwt.verify(token, jwtSecret);

            req.admin = await Admin.findById(decoded.id).select('-password');
            if (!req.admin) {
                return res.status(401).json({ success: false, message: 'Not authorized as admin' });
            }

            // 1. Account active check
            if (req.admin.status === 'Inactive') {
                return res.status(403).json({ success: false, message: 'Administrative account is deactivated' });
            }

            // 2. Project clearance check: Super Admin passes; sub-admins must have Moda Week clearance
            if (req.admin.role !== 'Super Admin') {
                const hasModaClearance = 
                    req.admin.permittedProjects?.includes('Moda Week International') ||
                    req.admin.permittedProjects?.includes('*');
                if (!hasModaClearance) {
                    return res.status(403).json({ success: false, message: 'Access clearance for Moda Week International is not granted' });
                }
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const authorizePermission = (section, action) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        // Super Admin has full, unrestricted access across all sections
        if (req.admin.role === 'Super Admin') {
            return next();
        }

        // Check if admin is active
        if (req.admin.status === 'Inactive') {
            return res.status(403).json({ success: false, message: 'Administrative account is deactivated' });
        }

        // Check project clearance
        const hasModaClearance = 
            req.admin.permittedProjects?.includes('Moda Week International') ||
            req.admin.permittedProjects?.includes('*');
        if (!hasModaClearance) {
            return res.status(403).json({ success: false, message: 'Access clearance for Moda Week International is not granted' });
        }

        // Granular section and action permission check
        const perms = req.admin.modaPermissions || {};
        const sectionPerm = perms instanceof Map ? perms.get(section) : perms[section];

        if (sectionPerm && sectionPerm[action] === true) {
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            message: `Access denied: missing '${action}' clearance for '${section}'` 
        });
    };
};

// Protect and authorize only if an admin token is passed (used for dual public/admin read endpoints)
export const optionalProtectAndAuthorize = (section, action) => {
    return async (req, res, next) => {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            return protect(req, res, () => {
                return authorizePermission(section, action)(req, res, next);
            });
        }
        // Unauthenticated public request
        next();
    };
};

export const protectScanner = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const jwtSecret = process.env.JWT_SECRET || 'thisisasercedtkeyformodaweekinternationalwhichissercure';
            const decoded = jwt.verify(token, jwtSecret);

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
            const jwtSecret = process.env.JWT_SECRET || 'thisisasercedtkeyformodaweekinternationalwhichissercure';
            const decoded = jwt.verify(token, jwtSecret);

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
