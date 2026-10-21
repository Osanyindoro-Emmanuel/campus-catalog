import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import adminAuthRoutes from './routes/adminAuth.js';
import storeConfigRoutes from './routes/storeConfigRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Endpoints
app.use('/api/v1/products', productRoutes);
app.use('/api/products', productRoutes); // Dual-mount for client compatibility
app.use('/api/admin', adminAuthRoutes);
app.use('/api/store-config', storeConfigRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running cleanly' });
});

// Database connection & Server initialization
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_catalog';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });

export default app;
