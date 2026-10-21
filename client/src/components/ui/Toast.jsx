import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-obsidian dark:bg-surface text-surface dark:text-obsidian px-5 py-3 rounded-full shadow-floating text-sm font-medium flex items-center gap-2 animate-slideUp pointer-events-none whitespace-nowrap"
    >
      {toastMessage}
    </div>
  );
}
