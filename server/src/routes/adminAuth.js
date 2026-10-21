import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const router = express.Router();

// ─── Rate Limiter: 5 Failed Attempts per IP per 10 Minutes ────────────────────
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 failed requests per windowMs
  skipSuccessfulRequests: true, // Only count failed attempts against the quota
  message: {
    message: 'Too many failed login attempts. Please try again after 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Middleware: Verify Bearer JWT Token ───────────────────────────────────────
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    req.admin = decoded;
    req.user = decoded; // Alias for broader compatibility
    next();
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Invalid or expired token', error: error.message });
  }
};

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const normalizedUsername = String(username).toLowerCase().trim();
    const user = await AdminUser.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// ─── GET /api/admin/verify ────────────────────────────────────────────────────
router.get('/verify', verifyAdminToken, (req, res) => {
  return res.status(200).json({
    valid: true,
    user: req.admin,
  });
});

// ─── POST /api/admin/setup (Initial Admin Seed) ──────────────────────────────
router.post('/setup', async (req, res) => {
  try {
    const count = await AdminUser.countDocuments();
    if (count > 0) {
      return res.status(403).json({ message: 'Admin setup closed: An admin account already exists.' });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new AdminUser({
      username: String(username).toLowerCase().trim(),
      passwordHash,
    });

    await newAdmin.save();
    return res.status(201).json({
      message: 'Initial admin created successfully',
      username: newAdmin.username,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
});

export default router;

