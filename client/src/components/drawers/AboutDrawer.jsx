import { X, CheckCircle } from 'lucide-react';

const PERKS = [
  { icon: '✅', text: 'Personal quality check on every order before dispatch' },
  { icon: '🚚', text: 'Fast doorstep delivery to UNIMAID hostels & campus gates' },
  { icon: '💬', text: 'WhatsApp-first ordering — zero apps to download' },
  { icon: '🔁', text: 'Easy exchange policy within 24 hours of delivery' },
  { icon: '🎓', text: 'Built for UNIMAID campus life — by a student, for students' },
];

export default function AboutDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-surface dark:bg-darkSurface rounded-t-2xl sm:rounded-2xl shadow-floating w-full max-w-sm max-h-[80vh] overflow-y-auto animate-slideUp sm:animate-fadeIn">
          <div className="p-6 pb-8 sm:pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-obsidian dark:text-canvas">
                👑 About Mide&apos;s Beauty World
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-canvas dark:hover:bg-darkHairline transition flex-none">
                <X size={18} className="text-muted dark:text-darkMuted" />
              </button>
            </div>

            {/* Brand story */}
            <p className="text-sm text-muted dark:text-darkMuted leading-relaxed mb-4">
              <strong className="text-obsidian dark:text-canvas">Mide&apos;s Beauty World</strong> is a verified UNIMAID campus boutique bringing you 100% unisex ready-to-wear streetwear, curated footwear, and accessories — all personally quality-checked before every single delivery.
            </p>
            <p className="text-sm text-muted dark:text-darkMuted leading-relaxed mb-5">
              We understand campus life: tight budgets, packed lecture schedules, and hostels that are hard to navigate. That&apos;s why we operate on WhatsApp — no apps, no sign-ups, just browse and tap to order.
            </p>

            {/* Perks */}
            <div className="space-y-3">
              {PERKS.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{icon}</span>
                  <p className="text-sm text-obsidian dark:text-canvas">{text}</p>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="mt-6 bg-accent-emeraldLight dark:bg-darkHairline rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-obsidian dark:text-canvas">
                🎓 Proudly serving the University of Maiduguri community
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

