import { useEffect, useState } from 'react';
import { Megaphone, GraduationCap, Truck, CreditCard, Save, Check, AlertCircle, Plus, Tags } from 'lucide-react';
import { DEFAULT_LECTURE_MODE_MESSAGE, useStoreConfig } from '../../context/StoreConfigContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { categoryKeyFromLabel, DEFAULT_CATEGORIES } from '../../utils/categories';

export default function SettingsView() {
  const { storeConfig, refetch, updateStoreConfig } = useStoreConfig();
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState(storeConfig?.categories || DEFAULT_CATEGORIES);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [categorySuccess, setCategorySuccess] = useState(null);

  useEffect(() => {
    if (storeConfig?.categories?.length) setCategories(storeConfig.categories);
  }, [storeConfig?.categories]);

  const [lectureModeMessage, setLectureModeMessage] = useState(
    storeConfig?.lectureModeMessage || DEFAULT_LECTURE_MODE_MESSAGE
  );
  const [lectureMessageEdited, setLectureMessageEdited] = useState(false);

  useEffect(() => {
    if (!lectureMessageEdited && storeConfig?.lectureModeMessage) {
      setLectureModeMessage(storeConfig.lectureModeMessage);
    }
  }, [storeConfig?.lectureModeMessage, lectureMessageEdited]);

  // Broadcast state
  const [broadcastActive, setBroadcastActive] = useState(storeConfig?.broadcast?.active ?? true);
  const [broadcastMessage, setBroadcastMessage] = useState(
    storeConfig?.broadcast?.message || '🔥 Weekend Hostel Drop: Deliveries active to UNIMAID hostels today!'
  );
  const [broadcastExpiry, setBroadcastExpiry] = useState(
    storeConfig?.broadcast?.expiresAt ? storeConfig.broadcast.expiresAt.slice(0, 16) : ''
  );

  // Delivery surcharge
  const [deliveryFee, setDeliveryFee] = useState(storeConfig?.deliveryFee ?? 500);

  // Bank Details
  const [bankName, setBankName] = useState(storeConfig?.bankDetails?.bankName || 'Opay');
  const [accountNumber, setAccountNumber] = useState(storeConfig?.bankDetails?.accountNumber || '8000000000');
  const [accountName, setAccountName] = useState(storeConfig?.bankDetails?.accountName || "Mide's Beauty World");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAddCategory = async (event) => {
    event.preventDefault();
    const label = categoryDraft.trim().replace(/\s+/g, ' ');
    const key = categoryKeyFromLabel(label);
    setCategoryError(null);
    setCategorySuccess(null);

    if (!label || !key || key === 'all') {
      setCategoryError('Enter a valid category name.');
      return;
    }
    if (categories.some((category) =>
      category.key === key || category.label.trim().toLowerCase() === label.toLowerCase()
    )) {
      setCategoryError('That category already exists.');
      return;
    }

    const updatedCategories = [...categories, { key, label }];
    setCategorySaving(true);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/store-config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories: updatedCategories }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not save this category.');

      setCategories(data.categories || updatedCategories);
      setCategoryDraft('');
      setCategorySuccess(`Added “${label}” to the catalog categories.`);
      refetch?.();
    } catch (error) {
      setCategoryError(error.message || 'Could not save this category.');
    } finally {
      setCategorySaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      deliveryFee: Number(deliveryFee) || 500,
      broadcast: {
        active: broadcastActive,
        message: broadcastMessage.trim(),
        expiresAt: broadcastExpiry ? new Date(broadcastExpiry).toISOString() : null,
      },
      lectureModeMessage: lectureModeMessage.trim() || DEFAULT_LECTURE_MODE_MESSAGE,
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
    };

    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/store-config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update settings on server.');
      }

      setSuccessMsg('Store settings updated and broadcasted live to all shoppers!');
      setTimeout(() => setSuccessMsg(null), 4000);
      updateStoreConfig({ lectureModeMessage: payload.lectureModeMessage });
      setLectureModeMessage(payload.lectureModeMessage);
      setLectureMessageEdited(false);
      refetch?.();
    } catch (error) {
      setErrorMsg(error.message || 'Could not save store settings. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3 space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display font-black text-xl text-neutral-900 dark:text-white">
          Campus Store Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Configure announcements, delivery rates, and checkout bank accounts
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* ── Section 1: Campus Broadcast Banner ── */}
        <section className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <GraduationCap size={16} />
            </span>
            <div>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">Lecture Mode Message</h2>
              <p className="text-[11px] text-neutral-400">Customize the storefront message shown while Lecture Mode is on.</p>
            </div>
          </div>
          <textarea
            value={lectureModeMessage}
            onChange={(event) => {
              setLectureModeMessage(event.target.value);
              setLectureMessageEdited(true);
            }}
            rows={2}
            maxLength={180}
            placeholder={DEFAULT_LECTURE_MODE_MESSAGE}
            className="w-full resize-y rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
          <p className="text-right text-[10px] text-neutral-400">{lectureModeMessage.length}/180</p>
        </section>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Megaphone size={16} />
              </span>
              <div>
                <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Campus Broadcast Banner
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Sticky announcement ticker shown at the top of the storefront
                </p>
              </div>
            </div>

            {/* Active Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={broadcastActive}
                onChange={(e) => setBroadcastActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C07052]" />
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Broadcast Message
            </label>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. 🔥 Flash Drop: 15% off kicks until 8 PM!"
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Expires At (Optional Countdown Timer)
            </label>
            <input
              type="datetime-local"
              value={broadcastExpiry}
              onChange={(e) => setBroadcastExpiry(e.target.value)}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* ── Section 2: Campus Delivery Surcharge ── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Truck size={16} />
            </span>
            <div>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                Campus Delivery Surcharge
              </h2>
              <p className="text-[11px] text-neutral-400">
                Flat fee applied to UNIMAID hostel room & gate deliveries (Pickup is ₦0)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Delivery Fee (₦)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* ── Section 3: Auto-Embedded Bank Details ── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard size={16} />
            </span>
            <div>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                Auto-Embedded Bank Details
              </h2>
              <p className="text-[11px] text-neutral-400">
                Appended to WhatsApp order checkout slips for frictionless bank transfer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="OPay, Kuda, Moniepoint"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Account Number
              </label>
              <input
                type="text"
                maxLength="10"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="8012345678"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Mide's Beauty World"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* ── Submit Action ── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 rounded-2xl bg-[#C07052] hover:bg-[#a85f44] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Save Store Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>

      <section className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-[#C07052]/10 text-[#C07052]">
            <Tags size={16} />
          </span>
          <div>
            <h2 className="font-bold text-sm text-neutral-900 dark:text-white">Product Categories</h2>
            <p className="text-[11px] text-neutral-400">Add categories for product listings and storefront filters.</p>
          </div>
        </div>

        {categoryError && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">{categoryError}</p>
        )}
        {categorySuccess && (
          <p className="text-xs text-emerald-700 dark:text-emerald-400" role="status">{categorySuccess}</p>
        )}

        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={categoryDraft}
            onChange={(event) => setCategoryDraft(event.target.value)}
            placeholder="e.g. Beauty & Personal Care"
            maxLength={40}
            className="min-w-0 flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={categorySaving}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 bg-[#C07052] hover:bg-[#a85f44] text-white text-xs font-bold transition disabled:opacity-60"
          >
            <Plus size={14} />
            {categorySaving ? 'Adding…' : 'Add Category'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category.key} className="rounded-full bg-neutral-100 dark:bg-white/10 px-3 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
              {category.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

