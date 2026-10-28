import { useState } from 'react';
import { Lock, Sun, Moon, BookOpen, GraduationCap, BarChart3, Package, Settings } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStoreConfig } from '../../context/StoreConfigContext';
import { useTheme } from '../../context/ThemeContext';
import CatalogView from '../../components/admin/CatalogView';
import AnalyticsView from '../../components/admin/AnalyticsView';
import SettingsView from '../../components/admin/SettingsView';

export default function AdminLayout() {
  const { setIsLocked, token } = useAdminAuth();
  const { storeConfig, updateStoreConfig } = useStoreConfig();
  const { isDark, toggle: toggleTheme } = useTheme();

  // Active navigation tab: 'catalog', 'analytics', 'settings'
  const [activeTab, setActiveTab] = useState('catalog');
  const [modeToggling, setModeToggling] = useState('');
  const [modeError, setModeError] = useState('');

  const handleToggleMode = async (field, currentValue, label) => {
    if (modeToggling) return;

    const nextValue = !currentValue;
    try {
      setModeToggling(field);
      setModeError('');
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${base}/store-config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: nextValue }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `The server could not update ${label}.`);
      }
      const savedValue = field === 'examinationMode'
        ? (data.examinationMode ?? data.lectureMode)
        : data[field];
      if (typeof savedValue !== 'boolean') throw new Error(`The server did not confirm ${label}.`);
      updateStoreConfig({ [field]: savedValue });
    } catch (error) {
      setModeError(error.message || `Could not update ${label}. Check your connection and try again.`);
    } finally {
      setModeToggling('');
    }
  };

  const isExaminationMode = storeConfig?.examinationMode ?? false;
  const isInLectureMode = storeConfig?.inLectureMode ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-neutral-900 dark:bg-[#121110] dark:text-neutral-100 transition-colors duration-200">
      {/* ─── Top Utility Header ─── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#181716]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-4 py-2.5 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">👑</span>
            <div className="leading-tight">
              <span className="font-display font-black text-sm tracking-tight text-neutral-900 dark:text-white">
                MBW STUDIO
              </span>
              <span className="block text-[9px] font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                Admin Center
              </span>
            </div>
          </div>

          {/* Right Header Utilities: Store Modes, Theme Toggle, Manual Lock */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Examination Mode toggle (stored under the legacy lectureMode API field). */}
            <button
              onClick={() => handleToggleMode('examinationMode', isExaminationMode, 'Examination Mode')}
              disabled={Boolean(modeToggling)}
              aria-pressed={isExaminationMode}
              aria-label={`Turn Examination Mode ${isExaminationMode ? 'off' : 'on'}`}
              title="Toggle Examination Mode notice on storefront"
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition active:scale-95 border ${
                isExaminationMode
                  ? 'bg-amber-400 text-neutral-900 border-amber-500 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-black/5 dark:border-white/5 hover:bg-neutral-200'
              }`}
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">Exam</span>
              <span>{isExaminationMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Lecture Mode toggle */}
            <button
              onClick={() => handleToggleMode('inLectureMode', isInLectureMode, 'Lecture Mode')}
              disabled={Boolean(modeToggling)}
              aria-pressed={isInLectureMode}
              aria-label={`Turn Lecture Mode ${isInLectureMode ? 'off' : 'on'}`}
              title="Toggle Lecture Mode notice on storefront"
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition active:scale-95 border ${
                isInLectureMode
                  ? 'bg-amber-400 text-neutral-900 border-amber-500 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-black/5 dark:border-white/5 hover:bg-neutral-200'
              }`}
            >
              <GraduationCap size={14} />
              <span className="hidden sm:inline">Lecture</span>
              <span>{isInLectureMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 transition"
            >
              {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>

            {/* Manual Lock Screen Button */}
            <button
              onClick={() => setIsLocked(true)}
              aria-label="Lock dashboard session"
              title="Lock dashboard"
              className="p-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition active:scale-90 shadow-xs"
            >
              <Lock size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content View ─── */}
      {modeError && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3" role="alert">
          <p className="rounded-xl border border-rose-300/60 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
            {modeError}
          </p>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* ─── Sticky Bottom Navigation (3 Tabs) ─── */}
      <nav
        aria-label="Admin navigation tabs"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181716]/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 px-6 py-2 shadow-lg transition-colors"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
          {/* 1. Analytics Tab */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition ${
              activeTab === 'analytics'
                ? 'text-[#C07052] font-extrabold bg-[#C07052]/10'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium'
            }`}
          >
            <BarChart3 size={18} className={activeTab === 'analytics' ? 'stroke-[2.5]' : ''} />
            <span className="text-[11px] mt-0.5 tracking-tight">Analytics</span>
          </button>

          {/* 2. Catalog Tab */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition ${
              activeTab === 'catalog'
                ? 'text-[#C07052] font-extrabold bg-[#C07052]/10'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium'
            }`}
          >
            <Package size={18} className={activeTab === 'catalog' ? 'stroke-[2.5]' : ''} />
            <span className="text-[11px] mt-0.5 tracking-tight">Catalog</span>
          </button>

          {/* 3. Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition ${
              activeTab === 'settings'
                ? 'text-[#C07052] font-extrabold bg-[#C07052]/10'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium'
            }`}
          >
            <Settings size={18} className={activeTab === 'settings' ? 'stroke-[2.5]' : ''} />
            <span className="text-[11px] mt-0.5 tracking-tight">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
