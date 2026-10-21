import { useState } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';

  if (!isOpen) return null;

  const handleTrack = () => {
    if (!query.trim()) return;
    const msg = `Hello Mide, I would like to check the delivery status of my campus order under the name/room: ${query.trim()}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface dark:bg-darkSurface rounded-2xl shadow-floating w-full max-w-sm p-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-obsidian dark:text-canvas">
              📦 Track Your Order
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-canvas dark:hover:bg-darkHairline transition"
            >
              <X size={18} className="text-muted dark:text-darkMuted" />
            </button>
          </div>

          {/* Input */}
          <label className="block text-sm font-medium text-obsidian dark:text-canvas mb-2">
            Your Name or Hostel Room Number
          </label>
          <input
            type="text"
            placeholder="e.g. Aisha / Block C Room 14"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="w-full rounded-xl border border-hairline dark:border-darkHairline bg-canvas dark:bg-obsidian px-4 py-3 text-sm text-obsidian dark:text-canvas placeholder:text-muted dark:placeholder:text-darkMuted focus:border-accent-terracotta focus:outline-none"
            autoFocus
          />

          <p className="text-xs text-muted dark:text-darkMuted mt-2">
            Enter the name or room you used when ordering. We'll open WhatsApp directly to check your delivery status.
          </p>

          {/* CTA */}
          <button
            onClick={handleTrack}
            disabled={!query.trim()}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-accent-emerald hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-xl transition active:scale-95"
          >
            <MessageCircle size={18} />
            Check Status on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}

