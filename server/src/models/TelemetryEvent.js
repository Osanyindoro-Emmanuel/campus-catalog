import mongoose from 'mongoose';

const telemetryEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['view', 'whatsapp_click', 'restock_inquiry', 'checkout'],
        message: '{VALUE} is not a valid telemetry event type',
      },
      lowercase: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    amount: {
      type: Number,
      default: null,
      min: 0,
    },
    fulfillment: {
      type: String,
      enum: ['pickup', 'room', 'landmark', null],
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '90d', // 90-day TTL index automatically purges old telemetry
    },
  },
  {
    timestamps: false,
  }
);

// Index to support querying events by product and type
telemetryEventSchema.index({ type: 1, productId: 1, createdAt: -1 });

export default mongoose.model('TelemetryEvent', telemetryEventSchema);

