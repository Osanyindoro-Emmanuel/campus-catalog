import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  publishAllDrafts,
  toggleStockStatus,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Bulk publish drafts
router.post('/publish-drafts', publishAllDrafts);

// Base products route: list & create
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Toggle stock status
router.patch('/:id/toggle-stock', toggleStockStatus);

// Product by ID: read, update, delete
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
