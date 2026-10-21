import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const StoreConfigContext = createContext(null);

const DEFAULT_CONFIG = {
  deliveryFee: Number(import.meta.env.VITE_CAMPUS_DELIVERY_FEE) || 500,
  lectureMode: false,
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
      const res = await fetch(`${base}/store-config`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        setStoreConfig((prev) => ({ ...DEFAULT_CONFIG, ...data }));
      }
    } catch {
      // Network failure — silently keep defaults (offline-first)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
    // Refresh config every 5 minutes
    const interval = setInterval(fetchConfig, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  return (
    <StoreConfigContext.Provider value={{ storeConfig, loading, refetch: fetchConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext);
  if (!ctx) throw new Error('useStoreConfig must be used inside StoreConfigProvider');
  return ctx;
}
