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
    res.status(200).json(config);
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

    const { deliveryFee, lectureMode, bankDetails, broadcast, fulfillmentSplit } = req.body;

    if (deliveryFee !== undefined) config.deliveryFee = deliveryFee;
    if (lectureMode !== undefined) config.lectureMode = lectureMode;
    if (bankDetails) {
      config.bankDetails = { ...config.bankDetails.toObject(), ...bankDetails };
    }
    if (broadcast) {
      config.broadcast = { ...config.broadcast.toObject(), ...broadcast };
    }
    if (fulfillmentSplit) {
      config.fulfillmentSplit = { ...config.fulfillmentSplit.toObject(), ...fulfillmentSplit };
    }

    await config.save();
    res.status(200).json(config);
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
    res.status(200).json({ lectureMode: config.lectureMode });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle lecture mode', error: error.message });
  }
});

export default router;

