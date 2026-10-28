import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_CATEGORIES } from '../utils/categories';

const StoreConfigContext = createContext(null);
const EXAMINATION_MODE_CACHE_KEY = 'mbw_examination_mode';
const LEGACY_LECTURE_MODE_CACHE_KEY = 'mbw_lecture_mode';

export const DEFAULT_LECTURE_MODE_MESSAGE =
  'Mide is in lectures right now. Orders are open; replies may be delayed until class ends.';

function readCachedLectureMode() {
  try {
    const cached = localStorage.getItem(EXAMINATION_MODE_CACHE_KEY)
      ?? localStorage.getItem(LEGACY_LECTURE_MODE_CACHE_KEY);
    return cached === 'true';
  } catch {
    return false;
  }
}

function cacheLectureMode(value) {
  try {
    localStorage.setItem(EXAMINATION_MODE_CACHE_KEY, String(Boolean(value)));
  } catch {
    // Storage can be unavailable in private browsing; server config remains authoritative.
  }
}

const DEFAULT_CONFIG = {
  categories: DEFAULT_CATEGORIES,
  deliveryFee: Number(import.meta.env.VITE_CAMPUS_DELIVERY_FEE) || 500,
  examinationMode: readCachedLectureMode(),
  inLectureMode: false,
  lectureModeMessage: DEFAULT_LECTURE_MODE_MESSAGE,
  bankDetails: {
    bankName: 'Opay',
    accountNumber: '8000000000',
    accountName: "Mide's Beauty World",
  },
  broadcast: {
    active: true,
    message: '🔥 Weekend Hostel Drop: Deliveries active to Murtala, Aisha & Gate 2 today!',
    expiresAt: null,
  },
};

export function StoreConfigProvider({ children }) {
  const [storeConfig, setStoreConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/store-config`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const { lectureMode: legacyExaminationMode, ...configData } = data;
        const examinationMode = data.examinationMode ?? legacyExaminationMode ?? false;
        setStoreConfig((prev) => ({ ...DEFAULT_CONFIG, ...configData, examinationMode }));
        cacheLectureMode(examinationMode);
      }
    } catch {
      // Network failure — silently keep defaults (offline-first)
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStoreConfig = useCallback((updates) => {
    setStoreConfig((prev) => ({ ...prev, ...updates }));
    if (typeof updates.examinationMode === 'boolean') cacheLectureMode(updates.examinationMode);
  }, []);

  useEffect(() => {
    fetchConfig();
    // Refresh config every 5 minutes
    const interval = setInterval(fetchConfig, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  return (
    <StoreConfigContext.Provider value={{ storeConfig, loading, refetch: fetchConfig, updateStoreConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext);
  if (!ctx) throw new Error('useStoreConfig must be used inside StoreConfigProvider');
  return ctx;
}
