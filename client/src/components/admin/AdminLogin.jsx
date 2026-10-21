import { useState } from 'react';
import { Lock, Unlock, User, Eye, EyeOff, ArrowRight, ShieldAlert, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { isAuthenticated, isLocked, user, login, unlock, logout } = useAdminAuth();

  const isLockMode = isAuthenticated && isLocked;

  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (!isLockMode && !username.trim()) {
      setError('Please enter your username');
      return;
    }

    try {
      setLoading(true);
      if (isLockMode) {
        await unlock(password);
      } else {
        await login(username.trim(), password);
      }
      setPassword('');
    } catch (err) {
      setError(typeof err?.message === 'string' && err.message.trim()
        ? err.message
        : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formCard = (
    <div
      className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-[#1C1A18]/95
                 border border-black/10 dark:border-white/10 shadow-2xl
                 p-6 sm:p-8 backdrop-blur-xl transition-all"
    >
      {/* ── Brand Header ── */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 shadow-inner">
          {isLockMode ? <Lock size={22} /> : <span className="text-2xl select-none">👑</span>}
        </div>
        <h1 className="font-display font-bold text-xl text-neutral-900 dark:text-white tracking-tight">
          {isLockMode ? 'Session Locked' : "Vendor Portal"}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[240px]">
          {isLockMode
            ? `Welcome back, ${user?.username || 'Admin'}. Enter your password to continue editing.`
            : "Sign in to manage catalog, orders, and broadcast banners."}
        </p>
      </div>

      {/* ── Error Notification ── */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <ShieldAlert size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Login Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field (Only shown in full login mode) */}
        {!isLockMode && (
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5 pl-1">
              Username
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
              />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={loading}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10
                           bg-neutral-50/80 dark:bg-neutral-900/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm
                           text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500
                           transition-colors disabled:opacity-60"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5 pl-1">
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Password
            </label>
            {isLockMode && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                Drafts preserved
              </span>
            )}
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLockMode ? 'current-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              autoFocus
              className="w-full rounded-2xl border border-black/10 dark:border-white/10
                         bg-neutral-50/80 dark:bg-neutral-900/80 pl-10 pr-10 py-2.5 text-xs sm:text-sm
                         text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500
                         transition-colors disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800
                     dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900
                     font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]
                     flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isLockMode ? (
            <>
              <Unlock size={16} />
              <span>Unlock Dashboard</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* ── Footer Actions ── */}
      {isLockMode && (
        <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-center">
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            <LogOut size={13} />
            <span>Switch Account / Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );

  // Full-page display for unauthenticated users
  if (!isLockMode) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF7F2] dark:bg-[#121110] p-4 text-neutral-900 dark:text-neutral-100 transition-colors">
        {formCard}
      </div>
    );
  }

  // Glassmorphic overlay for locked sessions (preserves underlying drafts)
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Unlock session"
      className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 animate-fadeIn"
    >
      {formCard}
    </div>
  );
}

