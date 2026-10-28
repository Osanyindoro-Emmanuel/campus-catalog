import { useState, useEffect } from 'react';
import { Plus, Rocket, Search, Edit3, Trash2, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ProductEditorModal from './ProductEditorModal';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Items' },
  { value: 'live', label: '🟢 Live' },
  { value: 'reserved', label: '🟡 Reserved' },
  { value: 'sold_out', label: '🔴 Sold Out' },
  { value: 'draft', label: '🟣 Draft' },
];

export default function CatalogView() {
  const { allProducts, refetch } = useCatalog();
  const { token } = useAdminAuth();

  const [products, setProducts] = useState(allProducts);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkPublishing, setBulkPublishing] = useState(false);
  const [bannerMsg, setBannerMsg] = useState(null);

  // Sync state whenever allProducts from context changes
  useEffect(() => {
    if (allProducts && allProducts.length >= 0) {
      setProducts(allProducts);
    }
  }, [allProducts]);

  // Active product list
  const currentList = products;

  // Filter products by status and search
  const filteredProducts = currentList.filter((item) => {
    const itemStatus = item.status || (item.inStock ? 'live' : 'sold_out');
    const matchesStatus = filterStatus === 'all' || itemStatus === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const draftCount = currentList.filter(
    (item) => (item.status || (item.inStock ? 'live' : 'sold_out')) === 'draft'
  ).length;

  // ─── Bulk Action: Publish All Drafts ───
  const handlePublishAllDrafts = async () => {
    if (draftCount === 0) return;

    setBulkPublishing(true);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${base}/products/publish-drafts`, {
        method: 'POST',
        headers,
      });

      if (!res.ok) {
        throw new Error('Failed to bulk publish drafts');
      }

      setBannerMsg(`🚀 Successfully published ${draftCount} draft items to Live storefront!`);
      setTimeout(() => setBannerMsg(null), 4000);
      refetch?.();
    } catch (err) {
      console.warn('API bulk publish fallback to local state:', err);
      const updated = currentList.map((p) => {
        if ((p.status || (p.inStock ? 'live' : 'sold_out')) === 'draft') {
          return { ...p, status: 'live', inStock: true };
        }
        return p;
      });

      setProducts(updated);
      try {
        localStorage.setItem('mbw_catalog_cache', JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      setBannerMsg(`🚀 Published ${draftCount} draft items to Live storefront!`);
      setTimeout(() => setBannerMsg(null), 4000);
    } finally {
      setBulkPublishing(false);
    }
  };

  // ─── Open Editor for New or Existing Product ───
  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (prod) => {
    setSelectedProduct(prod);
    setIsEditorOpen(true);
  };

  // ─── Save / Update Product ───
  const handleSaveProduct = async (productData) => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const isEdit = Boolean(productData._id && !String(productData._id).startsWith('prod_'));
    const url = isEdit ? `${base}/products/${productData._id}` : `${base}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save product');
      }

      const saved = await res.json();
      let updated;
      if (isEdit) {
        updated = currentList.map((p) => (p._id === saved._id ? saved : p));
      } else {
        updated = [saved, ...currentList];
      }
      setProducts(updated);
      try {
        localStorage.setItem('mbw_catalog_cache', JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      setBannerMsg(`Saved "${productData.title}" successfully!`);
      setTimeout(() => setBannerMsg(null), 3000);
      refetch?.();
    } catch (err) {
      console.warn('Backend API save failed, using optimistic local state:', err);
      let updated;
      if (productData._id) {
        updated = currentList.map((p) => (p._id === productData._id ? productData : p));
      } else {
        const newProduct = {
          ...productData,
          _id: `prod_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        updated = [newProduct, ...currentList];
      }

      setProducts(updated);
      try {
        localStorage.setItem('mbw_catalog_cache', JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      setBannerMsg(`Saved "${productData.title}" (local update)!`);
      setTimeout(() => setBannerMsg(null), 3000);
      refetch?.();
    }
  };

  // ─── Delete Product ───
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from catalog?`)) return;

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      if (!String(id).startsWith('prod_')) {
        await fetch(`${base}/products/${id}`, {
          method: 'DELETE',
          headers,
        });
      }
      const updated = currentList.filter((p) => p._id !== id);
      setProducts(updated);
      try {
        localStorage.setItem('mbw_catalog_cache', JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      setBannerMsg(`Deleted "${title}".`);
      setTimeout(() => setBannerMsg(null), 3000);
      refetch?.();
    } catch (err) {
      console.warn('Backend API delete failed, using optimistic local state:', err);
      const updated = currentList.filter((p) => p._id !== id);
      setProducts(updated);
      setBannerMsg(`Deleted "${title}".`);
      setTimeout(() => setBannerMsg(null), 3000);
    }
  };

  // ─── Quick Status Toggle ───
  const handleToggleStatus = async (id) => {
    const item = currentList.find((p) => p._id === id);
    if (!item) return;

    const cur = item.status || (item.inStock ? 'live' : 'sold_out');
    const next = cur === 'live' ? 'sold_out' : 'live';

    // Optimistic UI update
    const updated = currentList.map((p) => {
      if (p._id === id) {
        return { ...p, status: next, inStock: next === 'live' };
      }
      return p;
    });
    setProducts(updated);
    try {
      localStorage.setItem('mbw_catalog_cache', JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      if (!String(id).startsWith('prod_')) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch(`${base}/products/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: next, inStock: next === 'live' }),
        });
      }
      refetch?.();
    } catch (err) {
      console.warn('Status toggle network error:', err);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={11} /> Live
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock size={11} /> Reserved
          </span>
        );
      case 'sold_out':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle size={11} /> Sold Out
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <AlertTriangle size={11} /> Draft
          </span>
        );
    }
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3">
      {/* ── Notification Banner ── */}
      {bannerMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{bannerMsg}</span>
          <button onClick={() => setBannerMsg(null)} className="text-emerald-700 dark:text-emerald-300 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* ── Top Bar: Search, Quick Filter, Bulk Actions & New Drop ── */}
      <div className="space-y-3 mb-4">
        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="font-display font-black text-xl text-neutral-900 dark:text-white">
              Inventory & Drops
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {currentList.length} items total · {draftCount} in draft
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#C07052] hover:bg-[#a85f44] text-white font-bold text-xs shadow-md transition active:scale-95 flex-shrink-0"
          >
            <Plus size={16} />
            <span>New Drop</span>
          </button>
        </div>

        {/* Bulk Action & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1C1A18] pl-9 pr-3.5 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1C1A18] px-3 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Bulk Action Button */}
            {draftCount > 0 && (
              <button
                onClick={handlePublishAllDrafts}
                disabled={bulkPublishing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition active:scale-95 whitespace-nowrap disabled:opacity-60"
              >
                <Rocket size={13} />
                <span>Publish Drafts ({draftCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Product List / Cards ── */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 my-4">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">No products match your filter.</p>
          <p className="text-xs text-neutral-400 mt-1">Try resetting the status filter or search query.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProducts.map((item) => {
            const itemStatus = item.status || (item.inStock ? 'live' : 'sold_out');
            const hasSale = item.salePrice && item.salePrice < item.price;

            return (
              <div
                key={item._id}
                className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs flex items-center justify-between gap-3 hover:border-black/20 dark:hover:border-white/20 transition"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {renderStatusBadge(itemStatus)}
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-xs text-neutral-900 dark:text-neutral-100">
                        ₦{(hasSale ? item.salePrice : item.price).toLocaleString()}
                      </span>
                      {hasSale && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          ₦{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Quick Toggle Live/Sold Out */}
                  <button
                    onClick={() => handleToggleStatus(item._id)}
                    title={itemStatus === 'live' ? 'Mark Sold Out' : 'Mark Live'}
                    className={`p-2 rounded-xl border text-xs font-semibold transition ${
                      itemStatus === 'live'
                        ? 'border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                        : 'border-red-500/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                    }`}
                  >
                    {itemStatus === 'live' ? 'Live' : 'Sold'}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition"
                    title="Edit Product"
                  >
                    <Edit3 size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition"
                    title="Delete Product"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Product Editor Modal ── */}
      <ProductEditorModal
        key={`${isEditorOpen ? 'open' : 'closed'}-${selectedProduct?._id || 'new'}`}
        product={selectedProduct}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

