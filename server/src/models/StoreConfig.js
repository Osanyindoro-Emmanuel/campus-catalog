import mongoose from 'mongoose';

const DEFAULT_CATEGORIES = [
  { key: 'clothing', label: 'Clothing' },
  { key: 'footwear', label: 'Footwear' },
  { key: 'bags', label: 'Bags' },
  { key: 'jewelry', label: 'Jewelry & Accs' },
];

const categorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const storeConfigSchema = new mongoose.Schema(
  {
    categories: {
      type: [categorySchema],
      default: () => DEFAULT_CATEGORIES.map((category) => ({ ...category })),
    },
    deliveryFee: {
      type: Number,
      default: 500,
      min: 0,
    },
    lectureMode: {
      type: Boolean,
      default: false,
    },
    inLectureMode: {
      type: Boolean,
      default: false,
    },
    lectureModeMessage: {
      type: String,
      default: 'Mide is in lectures right now. Orders are open; replies may be delayed until class ends.',
      trim: true,
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

