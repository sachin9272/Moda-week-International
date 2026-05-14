import ScannerOperator from '../models/scannerOperatorModel.js';
import jwt from 'jsonwebtoken';
import { sendScannerInviteEmail } from '../utils/emailService.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Logged in for a month
    });
};

const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; // exclusions: o, 0, 1, l for readability
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Define your frontend scanner URL. Change this to match your production URL.
const SCANNER_URL = process.env.CLIENT_URL 
    ? `${process.env.CLIENT_URL.replace('/buy-tickets', '')}/scanner/login`
    : 'https://www.modaweekinternational.com/scanner/login';

// ADMIN ONLY API: Get all scanner operators
export const getScannerOperators = async (req, res) => {
    try {
        const operators = await ScannerOperator.find({})
            .populate('createdBy', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: operators });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN ONLY API: Create scanner operator
export const createScannerOperator = async (req, res) => {
    const { name, email } = req.body;

    try {
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Please provide name and email' });
        }

        const existingOperator = await ScannerOperator.findOne({ email });
        if (existingOperator) {
            return res.status(400).json({ success: false, message: 'A scanner operator with this email already exists' });
        }

        const plainPassword = generateRandomPassword();

        const newOperator = await ScannerOperator.create({
            name,
            email,
            password: plainPassword, // Hashed automatically via mongoose pre-save hook
            createdBy: req.admin._id
        });

        if (newOperator) {
            // Send Email invitation
            try {
                await sendScannerInviteEmail(email, name, plainPassword, SCANNER_URL);
            } catch (err) {
                console.error("Failed to send invitation email, but operator was created:", err);
                // We still return success but notify that email failed
                return res.status(201).json({ 
                    success: true, 
                    message: 'Operator created, but invitation email failed to send. You can reset their password to try again.',
                    data: newOperator 
                });
            }

            res.status(201).json({
                success: true,
                message: 'Scanner operator created and email invitation sent successfully.',
                data: newOperator
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN ONLY API: Delete scanner operator
export const deleteScannerOperator = async (req, res) => {
    try {
        const operator = await ScannerOperator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({ success: false, message: 'Operator not found' });
        }

        await ScannerOperator.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Operator deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN ONLY API: Toggle active status
export const toggleScannerOperatorStatus = async (req, res) => {
    try {
        const operator = await ScannerOperator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({ success: false, message: 'Operator not found' });
        }

        operator.isActive = !operator.isActive;
        await operator.save();

        res.status(200).json({ 
            success: true, 
            message: `Operator access ${operator.isActive ? 'activated' : 'deactivated'}`,
            data: operator 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN ONLY API: Regenerate and email new password
export const resetScannerOperatorPassword = async (req, res) => {
    try {
        const operator = await ScannerOperator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({ success: false, message: 'Operator not found' });
        }

        const plainPassword = generateRandomPassword();
        operator.password = plainPassword; // Will be re-hashed
        await operator.save();

        // Send email with new password
        await sendScannerInviteEmail(operator.email, operator.name, plainPassword, SCANNER_URL);

        res.status(200).json({ success: true, message: 'Password reset and new invitation email sent.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUBLIC API: Login scanner operator
export const loginScannerOperator = async (req, res) => {
    const { email, password } = req.body;

    try {
        const operator = await ScannerOperator.findOne({ email });

        if (!operator) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!operator.isActive) {
            return res.status(403).json({ success: false, message: 'Your operator account is deactivated. Please contact an Admin.' });
        }

        const isMatch = await operator.matchPassword(password);
        if (isMatch) {
            operator.lastLogin = Date.now();
            await operator.save();

            res.status(200).json({
                success: true,
                token: generateToken(operator._id),
                user: {
                    _id: operator._id,
                    name: operator.name,
                    email: operator.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PRIVATE API: Verify token & get profile for scanner operator UI
export const verifyScannerToken = async (req, res) => {
    try {
        // The protectScanner middleware already populates req.scannerOperator
        if (!req.scannerOperator) {
            return res.status(404).json({ success: false, message: 'Operator profile not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: req.scannerOperator._id,
                name: req.scannerOperator.name,
                email: req.scannerOperator.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
