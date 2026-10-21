import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'mbw_admin_token';
const USER_KEY = 'mbw_admin_user';
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const FILE_PICKER_SAFEGUARD_TIMEOUT = 60 * 1000; // 60 seconds

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error('The server returned an empty response. Please try again.');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('The server returned an invalid response. Please try again.');
  }
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLocked, setIsLocked] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

  // Refs for tracking timers and safeguarding against closures
  const inactivityTimerRef = useRef(null);
  const filePickerTimerRef = useRef(null);
  const filePickerActiveRef = useRef(false);
  const isLockedRef = useRef(isLocked);
  const tokenRef = useRef(token);

  isLockedRef.current = isLocked;
  tokenRef.current = token;

  // ─── File Picker Safeguard ──────────────────────────────────────────────────
  // Pauses the visibilitychange lock for 60 seconds when user is selecting photos
  const triggerFilePickerSafeguard = useCallback((durationMs = FILE_PICKER_SAFEGUARD_TIMEOUT) => {
    filePickerActiveRef.current = true;
    setIsFilePickerOpen(true);

    if (filePickerTimerRef.current) clearTimeout(filePickerTimerRef.current);
    filePickerTimerRef.current = setTimeout(() => {
      filePickerActiveRef.current = false;
      setIsFilePickerOpen(false);
    }, durationMs);
  }, []);

  const clearFilePickerSafeguard = useCallback(() => {
    if (filePickerTimerRef.current) clearTimeout(filePickerTimerRef.current);
    filePickerActiveRef.current = false;
    setIsFilePickerOpen(false);
  }, []);

  // ─── 15-Minute Inactivity Timer ─────────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    // Only run the idle timer if the admin is authenticated and currently unlocked
    if (tokenRef.current && !isLockedRef.current) {
      inactivityTimerRef.current = setTimeout(() => {
        setIsLocked(true);
      }, INACTIVITY_TIMEOUT);
    }
  }, []);

  useEffect(() => {
    if (!token || isLocked) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      return;
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [token, isLocked, resetInactivityTimer]);

  // ─── Visibility Change Listener (Tab-Switch / Minimize Lock) ────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // If file picker is open (native OS file dialog causes visibility change), pause lock
        if (filePickerActiveRef.current) {
          return;
        }

        // Lock when tab is switched or browser is minimized if authenticated
        if (tokenRef.current && !isLockedRef.current) {
          setIsLocked(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ─── Login Action ───────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    let res;
    try {
      res = await fetch(`${base}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      throw new Error('Unable to reach the server. Please try again.');
    }

    const data = await readJsonResponse(res);
    if (!res.ok) {
      throw new Error(data.message || 'Incorrect username or password.');
    }

    if (!data.token || !data.user) {
      throw new Error('The server returned an invalid response. Please try again.');
    }

    setToken(data.token);
    setUser(data.user);
    setIsLocked(false);

    try {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch {
      /* ignore storage errors */
    }

    return data;
  }, []);

  // ─── Unlock Action ──────────────────────────────────────────────────────────
  const unlock = useCallback(
    async (password) => {
      return login('admin', password);
    },
    [login]
  );

  // ─── Logout Action ──────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLocked(false);
    clearFilePickerSafeguard();

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, [clearFilePickerSafeguard]);

  // ─── Token Verification On Startup ──────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${base}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          logout();
        }
      } catch {
        // Network offline — allow cached offline token to persist
      }
    };

    verify();
  }, [token, logout]);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLocked,
        setIsLocked,
        login,
        unlock,
        logout,
        isFilePickerOpen,
        triggerFilePickerSafeguard,
        clearFilePickerSafeguard,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

