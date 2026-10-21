import { useState, useRef } from 'react';
import { X, Upload, Link, Check, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { compressImageToWebP, uploadToCloudinary } from '../../utils/imageCompressor';

const CATEGORIES = [
  { value: 'clothing', label: '👕 Clothing' },
  { value: 'footwear', label: '👟 Footwear' },
  { value: 'bags', label: '🎒 Bags' },
  { value: 'jewelry', label: '✨ Jewelry & Accs' },
];

const STATUSES = [
  { value: 'live', label: '🟢 Live (In Stock)' },
  { value: 'reserved', label: '🟡 Reserved (Hold)' },
  { value: 'sold_out', label: '🔴 Sold Out' },
  { value: 'draft', label: '🟣 Draft' },
];

export default function ProductEditorModal({ product, isOpen, onClose, onSave }) {
  const { triggerFilePickerSafeguard, clearFilePickerSafeguard } = useAdminAuth();

  const isEditing = !!product?._id;

  const [title, setTitle] = useState(product?.title || '');
  const [category, setCategory] = useState(product?.category?.toLowerCase() || 'clothing');
  const [price, setPrice] = useState(product?.price || '');
  const [salePrice, setSalePrice] = useState(product?.salePrice || '');
  const [status, setStatus] = useState(product?.status || 'live');
  const [sizesInput, setSizesInput] = useState(Array.isArray(product?.sizes) ? product.sizes.join(', ') : '');
  const [description, setDescription] = useState(product?.description || '');

  // Image tab: 'upload' or 'url'
  const [imageTab, setImageTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const [imageSizeKb, setImageSizeKb] = useState(null);

  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // ─── File Picker Safeguard Trigger ───
  const handlePickFileClick = () => {
    // Pause visibility lock for 60s while the native file picker is open
    triggerFilePickerSafeguard(60000);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      clearFilePickerSafeguard();
      return;
    }

    try {
      setCompressing(true);
      setError(null);

      // Compress to WebP (max 800px, target ~150-180KB)
      const compressed = await compressImageToWebP(file, { maxWidth: 800, quality: 0.82 });
      setImageSizeKb(compressed.sizeKb);
      setImagePreview(compressed.dataUrl);

      // Upload to Cloudinary (or local permanent WebP Base64 dataUrl fallback)
      const uploadedUrl = await uploadToCloudinary(compressed.blob, compressed.dataUrl);
      setImageUrl(uploadedUrl);
    } catch (err) {
      setError(err.message || 'Image processing failed');
    } finally {
      setCompressing(false);
      clearFilePickerSafeguard();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }

    const basePriceNum = Number(price);
    if (!basePriceNum || basePriceNum <= 0) {
      setError('Please provide a valid base price.');
      return;
    }

    const salePriceNum = salePrice ? Number(salePrice) : null;
    if (salePriceNum !== null) {
      if (salePriceNum <= 0) {
        setError('Sale price must be greater than 0.');
        return;
      }
      if (salePriceNum >= basePriceNum) {
        setError('Sale price must be strictly lower than base price.');
        return;
      }
    }

    let finalImage = imageUrl || imagePreview;
    if (!finalImage) {
      setError('Please provide a product image (upload or paste URL).');
      return;
    }

    // Safeguard: Never allow an ephemeral blob: URL to be saved to MongoDB
    if (finalImage.startsWith('blob:') && imagePreview && !imagePreview.startsWith('blob:')) {
      finalImage = imagePreview;
    }

    // Parse size chips from comma-separated string
    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...product,
      title: title.trim(),
      category,
      price: basePriceNum,
      salePrice: salePriceNum,
      status,
      sizes,
      imageUrl: finalImage,
      description: description.trim(),
    };

    try {
      setSaving(true);
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div
        className="w-full sm:max-w-lg max-h-[90vh] bg-white dark:bg-[#1C1A18] rounded-t-3xl sm:rounded-3xl
                   border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slideUp"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
            </span>
            <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white">
              {isEditing ? 'Edit Product' : 'Add New Drop'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage Wash Denim Jacket"
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Inventory Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Base Price & Sale Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Base Price (₦) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Sale Price (₦) <span className="text-[10px] text-neutral-400 font-normal">Optional</span>
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="21000"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Size Chips */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Sizes Available <span className="text-[10px] text-neutral-400 font-normal">(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="e.g. S, M, L, XL or 40, 41, 42, 43"
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Image Uploader & Dual Tabs */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Product Image *
              </label>
              <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    imageTab === 'upload'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  <Upload size={12} className="inline mr-1 -mt-0.5" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    imageTab === 'url'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  <Link size={12} className="inline mr-1 -mt-0.5" />
                  Paste URL
                </button>
              </div>
            </div>

            {imageTab === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handlePickFileClick}
                  disabled={compressing}
                  className="w-full border-2 border-dashed border-black/15 dark:border-white/15 rounded-2xl p-4 text-center hover:bg-neutral-50 dark:hover:bg-white/5 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon size={22} className="text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    {compressing ? 'Compressing to WebP...' : 'Choose Photo to Compress & Upload'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Auto-scaled to WebP (max 800px ~180KB)
                  </span>
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Live Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative flex items-center gap-3 p-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    Ready for drop
                  </p>
                  {imageSizeKb && (
                    <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      WebP · {imageSizeKb} KB
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setImagePreview('');
                    setImageSizeKb(null);
                  }}
                  className="p-1 rounded-full text-neutral-400 hover:text-red-500 transition"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full-grain leather, Air-Sole cushioning. Unisex campus essential."
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || compressing}
              className="flex-1 py-2.5 rounded-2xl bg-[#C07052] hover:bg-[#a85f44] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={14} />
                  <span>{isEditing ? 'Save Changes' : 'Publish Drop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

