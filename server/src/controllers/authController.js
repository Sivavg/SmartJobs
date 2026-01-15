const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, companyName, companyLogo, companyWebsite, aboutCompany } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let companyId = null;

        // If recruiter, create company first
        if (role === 'recruiter' && companyName) {
            const company = await Company.create({
                name: companyName,
                logo: companyLogo || null,
                website: companyWebsite || null,
                about: aboutCompany || null,
            });
            companyId = company.id;
        }

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            companyId,
        });

        const payload = {
            id: user.id,
            role: user.role,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            id: user.id,
            role: user.role,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const { PasswordReset } = require('../models');
    const crypto = require('crypto');

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'No account found with that email address' });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create password reset record
        await PasswordReset.create({
            email,
            token,
            expiresAt,
        });

        res.json({
            message: 'Password reset token generated',
            token,
            expiresIn: '15 minutes'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Validate reset token
exports.validateResetToken = async (req, res) => {
    const { token } = req.params;
    const { PasswordReset } = require('../models');

    try {
        const resetRecord = await PasswordReset.findOne({ where: { token } });

        if (!resetRecord) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        if (resetRecord.used) {
            return res.status(400).json({ message: 'Token has already been used' });
        }

        if (new Date() > resetRecord.expiresAt) {
            return res.status(400).json({ message: 'Token has expired' });
        }

        res.json({ message: 'Token is valid', email: resetRecord.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const { PasswordReset } = require('../models');

    try {
        const resetRecord = await PasswordReset.findOne({ where: { token } });

        if (!resetRecord) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        if (resetRecord.used) {
            return res.status(400).json({ message: 'Token has already been used' });
        }

        if (new Date() > resetRecord.expiresAt) {
            return res.status(400).json({ message: 'Token has expired' });
        }

        // Find user and update password
        const user = await User.findOne({ where: { email: resetRecord.email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Mark token as used
        resetRecord.used = true;
        await resetRecord.save();

        res.json({ message: 'Password successfully reset' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
