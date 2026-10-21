import mongoose from 'mongoose';

const storeConfigSchema = new mongoose.Schema(
  {
    deliveryFee: {
      type: Number,
      default: 500,
      min: 0,
    },
    lectureMode: {
      type: Boolean,
      default: false,
    },
    bankDetails: {
      bankName: {
        type: String,
        default: '',
        trim: true,
      },
      accountNumber: {
        type: String,
        default: '',
        trim: true,
      },
      accountName: {
        type: String,
        default: '',
        trim: true,
      },
    },
    broadcast: {
      active: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: '',
        trim: true,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
    pipelineValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    checkoutCounts: {
      type: Number,
      default: 0,
      min: 0,
    },
    fulfillmentSplit: {
      pickup: {
        type: Number,
        default: 0,
        min: 0,
      },
      room: {
        type: Number,
        default: 0,
        min: 0,
      },
      landmark: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StoreConfig', storeConfigSchema);

