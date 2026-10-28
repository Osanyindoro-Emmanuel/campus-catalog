import Product from '../models/Product.js';

// 1. Get all products (with category filter and draft exclusion for public storefront)
export const getProducts = async (req, res) => {
  try {
    const { category, includeDrafts } = req.query;
    const filter = {};

    if (category && category.toLowerCase() !== 'all') {
      filter.category = category.toLowerCase();
    }

    // Unless explicitly requested by admin, hide drafts from public storefront
    if (includeDrafts !== 'true') {
      filter.$or = [
        { status: { $in: ['live', 'reserved', 'sold_out'] } },
        { status: { $exists: false }, inStock: true },
        { status: null, inStock: true },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// 2. Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// 3. Add a new product (Admin Portal / Vendor)
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      salePrice,
      status,
      reservedUntil,
      sizes,
      imageUrl,
      description,
    } = req.body;

    const initialStatus = status || 'live';
    const newProduct = new Product({
      title,
      category: category ? category.toLowerCase() : 'clothing',
      price,
      salePrice: salePrice || null,
      status: initialStatus,
      reservedUntil: reservedUntil || null,
      sizes: Array.isArray(sizes) ? sizes : [],
      imageUrl,
      description: description || '',
      inStock: initialStatus === 'live',
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// 4. Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      price,
      salePrice,
      status,
      reservedUntil,
      sizes,
      imageUrl,
      description,
      inStock,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (title !== undefined) product.title = title;
    if (category !== undefined) product.category = category.toLowerCase();
    if (price !== undefined) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice || null;
    if (status !== undefined) {
      product.status = status;
      product.inStock = status === 'live';
    }
    if (inStock !== undefined && status === undefined) {
      product.inStock = inStock;
      product.status = inStock ? 'live' : 'sold_out';
    }
    if (reservedUntil !== undefined) product.reservedUntil = reservedUntil;
    if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : [];
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (description !== undefined) product.description = description;

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// 5. Bulk publish all drafts to Live
export const publishAllDrafts = async (req, res) => {
  try {
    const result = await Product.updateMany(
      { status: 'draft' },
      { $set: { status: 'live', inStock: true } }
    );
    res.status(200).json({
      message: 'All drafts published successfully',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish drafts', error: error.message });
  }
};

// 6. Toggle inStock status (Available <-> Sold Out)
export const toggleStockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.inStock = !product.inStock;
    product.status = product.inStock ? 'live' : 'sold_out';
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock status', error: error.message });
  }
};

// 7. Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
