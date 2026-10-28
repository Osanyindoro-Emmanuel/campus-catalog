import express from 'express';
import StoreConfig from '../models/StoreConfig.js';
import { verifyAdminToken } from './adminAuth.js';

const router = express.Router();

// GET /api/store-config (Public endpoint for storefront + admin)
router.get('/', async (req, res) => {
  try {
    let config = await StoreConfig.findOne();
    if (!config) {
      config = await StoreConfig.create({
        deliveryFee: 500,
        lectureMode: false,
        bankDetails: {
          bankName: 'Opay',
          accountNumber: '8000000000',
          accountName: "Mide's Beauty World",
        },
        broadcast: {
          active: true,
          message: '🔥 Weekend Hostel Drop: Deliveries active to UNIMAID hostels today!',
          expiresAt: null,
        },
      });
    }
    res.status(200).json({ ...config.toObject(), examinationMode: config.lectureMode });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store config', error: error.message });
  }
});

// PATCH /api/store-config (Protected admin endpoint)
router.patch('/', verifyAdminToken, async (req, res) => {
  try {
    let config = await StoreConfig.findOne();
    if (!config) {
      config = new StoreConfig();
    }

    const {
      deliveryFee,
      examinationMode,
      lectureMode: legacyExaminationMode,
      inLectureMode,
      lectureModeMessage,
      bankDetails,
      broadcast,
      fulfillmentSplit,
      categories,
    } = req.body;

    if (deliveryFee !== undefined) config.deliveryFee = deliveryFee;
    const nextExaminationMode = examinationMode ?? legacyExaminationMode;
    if (nextExaminationMode !== undefined) config.lectureMode = nextExaminationMode;
    if (inLectureMode !== undefined) config.inLectureMode = inLectureMode;
    if (lectureModeMessage !== undefined) config.lectureModeMessage = lectureModeMessage;
    if (bankDetails) {
      config.bankDetails = { ...config.bankDetails.toObject(), ...bankDetails };
    }
    if (broadcast) {
      config.broadcast = { ...config.broadcast.toObject(), ...broadcast };
    }
    if (fulfillmentSplit) {
      config.fulfillmentSplit = { ...config.fulfillmentSplit.toObject(), ...fulfillmentSplit };
    }
    if (categories !== undefined) {
      if (!Array.isArray(categories)) {
        return res.status(400).json({ message: 'Categories must be a list.' });
      }
      const normalizedCategories = categories.map(({ key, label } = {}) => ({
        key: String(key || '').trim().toLowerCase(),
        label: String(label || '').trim(),
      }));
      const keys = normalizedCategories.map(({ key }) => key);
      if (
        normalizedCategories.some(({ key, label }) => !key || !label || key === 'all') ||
        new Set(keys).size !== keys.length
      ) {
        return res.status(400).json({ message: 'Each category needs a unique key and label.' });
      }
      config.categories = normalizedCategories;
    }

    await config.save();
    res.status(200).json({ ...config.toObject(), examinationMode: config.lectureMode });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update store config', error: error.message });
  }
});

// POST /api/store-config/toggle-lecture (Convenience toggle endpoint)
router.post('/toggle-lecture', verifyAdminToken, async (req, res) => {
  try {
    let config = await StoreConfig.findOne();
    if (!config) {
      config = new StoreConfig();
    }
    config.lectureMode = !config.lectureMode;
    await config.save();
    res.status(200).json({ lectureMode: config.lectureMode, examinationMode: config.lectureMode });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle lecture mode', error: error.message });
  }
});

export default router;

