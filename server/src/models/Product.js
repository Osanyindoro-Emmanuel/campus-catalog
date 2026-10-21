import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: {
        values: ['clothing', 'footwear', 'bags', 'jewelry'],
        message: '{VALUE} is not a supported category',
      },
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price in Naira'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      default: null,
      min: [0, 'Sale price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['live', 'reserved', 'sold_out', 'draft'],
      default: 'live',
      lowercase: true,
      trim: true,
    },
    reservedUntil: {
      type: Date,
      default: null,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    popularity: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Telemetry counters
    clicksToWhatsApp: {
      type: Number,
      default: 0,
      min: 0,
    },
    restockInquiries: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Legacy inStock field kept in sync for backward compatibility
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep legacy inStock aligned with status
productSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.inStock = this.status === 'live';
  } else if (this.isModified('inStock') && !this.isModified('status')) {
    this.status = this.inStock ? 'live' : 'sold_out';
  }
  next();
});

export default mongoose.model('Product', productSchema);
