import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useStoreConfig } from '../../context/StoreConfigContext';

function formatCountdown(ms) {
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function CampusBroadcastBar() {
  const { storeConfig } = useStoreConfig();
  const { broadcast, lectureMode } = storeConfig;

  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('mbw_broadcast_dismissed') === 'true'
  );
  const [countdown, setCountdown] = useState(null);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!broadcast?.active || !broadcast?.expiresAt) return;

    const tick = () => {
      const remaining = new Date(broadcast.expiresAt).getTime() - Date.now();
      if (remaining <= 0) {
        setExpired(true);
        clearInterval(intervalRef.current);
        setCountdown(null);
      } else {
        setCountdown(formatCountdown(remaining));
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [broadcast?.expiresAt, broadcast?.active]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('mbw_broadcast_dismissed', 'true');
  };

  const showBroadcast = broadcast?.active && !expired && !dismissed;
  const showLectureMode = lectureMode && !dismissed;

  if (!showBroadcast && !showLectureMode) return null;

  return (
    <div className="bg-obsidian dark:bg-accent-terracotta text-surface py-2 px-4 text-center relative">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {showLectureMode && (
          <span className="bg-amber-400 text-obsidian font-semibold text-xs px-3 py-1 rounded-full whitespace-nowrap">
            📚 Mide is currently in lectures. Orders remain open; replies & deliveries resume shortly!
          </span>
        )}
        {showBroadcast && (
          <span className="text-xs md:text-sm font-medium">
            {broadcast.message}
            {countdown && (
              <span className="ml-2 font-mono font-bold text-accent-gold dark:text-obsidian">
                Ends in: {countdown}
              </span>
            )}
          </span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition"
      >
        <X size={14} />
      </button>
    </div>
  );
}
