import { X, MessageCircle, Phone, Clock } from 'lucide-react';

export default function ContactDrawer({ isOpen, onClose }) {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';
  const phoneLine = import.meta.env.VITE_PHONE_LINE || '+2348000000000';

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-surface dark:bg-darkSurface rounded-t-2xl sm:rounded-2xl shadow-floating w-full max-w-sm p-6 pb-8 sm:pb-6 animate-slideUp sm:animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-obsidian dark:text-canvas">
              💬 Get in Touch
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-canvas dark:hover:bg-darkHairline transition">
              <X size={18} className="text-muted dark:text-darkMuted" />
            </button>
          </div>

          {/* WhatsApp button */}
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent("Hi Mide! I'd like to ask about your products 🛍️")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-accent-emerald hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl w-full transition active:scale-95 mb-3"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>

          {/* Phone call button */}
          <a
            href={`tel:${phoneLine}`}
            className="flex items-center justify-center gap-2 bg-canvas dark:bg-darkHairline border border-hairline dark:border-darkHairline text-obsidian dark:text-canvas font-semibold text-sm px-6 py-3.5 rounded-xl w-full transition hover:border-obsidian dark:hover:border-white active:scale-95"
          >
            <Phone size={18} />
            Call Mide Directly
          </a>

          {/* Operational info card */}
          <div className="mt-5 bg-canvas dark:bg-obsidian rounded-xl p-4 border border-hairline dark:border-darkHairline">
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-accent-terracotta mt-0.5 flex-none" />
              <div>
                <p className="text-sm font-semibold text-obsidian dark:text-canvas">Campus Delivery Hours</p>
                <p className="text-xs text-muted dark:text-darkMuted mt-1 leading-relaxed">
                  Monday – Saturday, 10:00 AM – 7:00 PM.
                  Fast doorstep handoff to your campus hostel, lodge, or main gate meetup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

