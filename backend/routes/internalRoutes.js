import express from 'express';
import crypto from 'crypto';
import Admin from '../models/adminModel.js';

const router = express.Router();

// Middleware to verify master API key for cross-service calls
const verifyMasterApiKey = (req, res, next) => {
    const apiKey = req.headers['x-master-api-key'] || req.query.apiKey;
    const expectedKey = process.env.MASTER_API_KEY || 'super_secret_master_key_123';

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'Unauthorized service communication' });
    }

    try {
        const apiKeyBuf = Buffer.from(String(apiKey));
        const expectedBuf = Buffer.from(String(expectedKey));
        if (apiKeyBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(apiKeyBuf, expectedBuf)) {
            return res.status(401).json({ success: false, message: 'Unauthorized service communication' });
        }
    } catch {
        return res.status(401).json({ success: false, message: 'Unauthorized service communication' });
    }

    next();
};

router.use(verifyMasterApiKey);

// Sanitize and validate permissions structure to guarantee boolean flags and fail-closed integrity
const sanitizePermissions = (rawPermissions) => {
    if (!rawPermissions || typeof rawPermissions !== 'object') return {};
    const sanitized = {};
    for (const [section, actions] of Object.entries(rawPermissions)) {
        if (!actions || typeof actions !== 'object') continue;
        sanitized[section] = {
            view: Boolean(actions.view),
            create: Boolean(actions.create),
            edit: Boolean(actions.edit),
            delete: Boolean(actions.delete)
        };
    }
    return sanitized;
};

// Health check
router.get('/health', (req, res) => {
    res.json({ success: true, service: 'Moda-Week-Internal-Permissions', status: 'healthy' });
});

// Sync permissions from Esmeralda Master Admin
router.post('/sync', async (req, res) => {
    try {
        const {
            esmeraldaUserId,
            email,
            name,
            role,
            status,
            permittedProjects,
            modaPermissions,
            password
        } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required for synchronization' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Safe identity resolution
        let admin = null;
        if (esmeraldaUserId) {
            admin = await Admin.findOne({ esmeraldaUserId });
        }

        if (!admin) {
            const adminByEmail = await Admin.findOne({ email: normalizedEmail });
            if (adminByEmail) {
                admin = adminByEmail;
            }
        }

        if (admin) {
            // Update existing admin
            if (esmeraldaUserId) admin.esmeraldaUserId = esmeraldaUserId;
            if (name) admin.name = name;
            admin.email = normalizedEmail;
            if (role) admin.role = role;
            if (status) admin.status = status;
            if (permittedProjects) admin.permittedProjects = permittedProjects;
            if (modaPermissions) admin.modaPermissions = sanitizePermissions(modaPermissions);
            if (password) {
                admin.password = password;
            }
            admin.source = 'esmeralda_master';
            await admin.save();

            return res.status(200).json({
                success: true,
                message: 'Admin permissions updated successfully',
                data: {
                    id: admin._id,
                    esmeraldaUserId: admin.esmeraldaUserId,
                    email: admin.email,
                    role: admin.role,
                    status: admin.status
                }
            });
        }

        // Create new admin account
        const fallbackPassword = password || (Math.random().toString(36).slice(-10) + 'A1!moda');
        admin = await Admin.create({
            esmeraldaUserId,
            name: name || '',
            email: normalizedEmail,
            role: role || 'Admin Access',
            status: status || 'Active',
            permittedProjects: permittedProjects || ['Moda Week International'],
            modaPermissions: sanitizePermissions(modaPermissions),
            password: fallbackPassword,
            source: 'esmeralda_master'
        });

        return res.status(201).json({
            success: true,
            message: 'Admin account created and permissions synced successfully',
            data: {
                id: admin._id,
                esmeraldaUserId: admin.esmeraldaUserId,
                email: admin.email,
                role: admin.role,
                status: admin.status
            }
        });
    } catch (error) {
        console.error('Error synchronizing permissions:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
});

// Revoke / delete sub-admin access
router.delete('/sync/:esmeraldaUserId', async (req, res) => {
    try {
        const { esmeraldaUserId } = req.params;
        let admin = null;
        if (esmeraldaUserId && esmeraldaUserId !== 'undefined') {
            admin = await Admin.findOne({ esmeraldaUserId });
        }

        if (!admin && req.query.email) {
            admin = await Admin.findOne({ email: req.query.email.toLowerCase().trim() });
        }

        if (!admin) {
            return res.status(200).json({ success: true, message: 'No matching admin found or already revoked' });
        }

        // Remove admin so clean recreation with the same email works without identity conflict
        await Admin.findByIdAndDelete(admin._id);

        return res.status(200).json({ success: true, message: 'Admin account removed and permissions revoked' });
    } catch (error) {
        console.error('Error revoking permissions:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
});

export default router;
