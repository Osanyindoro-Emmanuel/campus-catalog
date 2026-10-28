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
  const { broadcast, examinationMode, inLectureMode, lectureModeMessage } = storeConfig;

  const broadcastSignature = JSON.stringify([
    broadcast?.message || '',
    broadcast?.expiresAt || '',
  ]);
  const [dismissedBroadcast, setDismissedBroadcast] = useState(
    () => sessionStorage.getItem('mbw_broadcast_dismissed') || ''
  );
  const [countdown, setCountdown] = useState(null);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setExpired(false);
    if (!broadcast?.active || !broadcast?.expiresAt) {
      setCountdown(null);
      return;
    }

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
  }, [broadcast?.expiresAt, broadcast?.active, broadcast?.message]);

  useEffect(() => {
    if (broadcast?.active) return;
    sessionStorage.removeItem('mbw_broadcast_dismissed');
    setDismissedBroadcast('');
  }, [broadcast?.active]);

  const handleDismiss = () => {
    setDismissedBroadcast(broadcastSignature);
    sessionStorage.setItem('mbw_broadcast_dismissed', broadcastSignature);
  };

  const showBroadcast = broadcast?.active && !expired && dismissedBroadcast !== broadcastSignature;
  // Examination Mode is a store status and should remain visible until the admin turns it off.
  // Dismissing the temporary promo must not hide it for the rest of the browser session.
  const showExaminationMode = examinationMode;
  const showLectureMode = inLectureMode;

  if (!showBroadcast && !showExaminationMode && !showLectureMode) return null;

  return (
    <div className="bg-obsidian dark:bg-accent-terracotta text-surface py-1.5 px-10 sm:px-4 text-center relative">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
        {showExaminationMode && (
          <span className="inline-flex max-w-full items-center justify-center gap-1.5 rounded-full bg-amber-300/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium leading-snug text-amber-100">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span><strong className="font-semibold">Examination Mode</strong> · Orders are open; replies and deliveries resume shortly.</span>
          </span>
        )}
        {showLectureMode && (
          <span className="inline-flex max-w-full items-center justify-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium leading-snug text-surface">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span><strong className="font-semibold">Lecture Mode</strong> · {lectureModeMessage}</span>
          </span>
        )}
        {showBroadcast && (
          <span className="max-w-full text-[10px] sm:text-xs md:text-sm leading-snug font-medium">
            {broadcast.message}
            {countdown && (
              <span className="ml-2 font-mono font-bold text-accent-gold dark:text-obsidian">
                Ends in: {countdown}
              </span>
            )}
          </span>
        )}
      </div>
      {showBroadcast && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-2 sm:right-3 sm:top-1/2 sm:-translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
