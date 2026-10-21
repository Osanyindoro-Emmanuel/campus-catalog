import { X, MapPin, Phone, Info } from 'lucide-react';

export default function MobileUtilityDrawer({ isOpen, onClose, onAbout, onContact, onTrack }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface dark:bg-darkSurface shadow-floating flex flex-col transform transition-transform duration-350 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline dark:border-darkHairline">
          <span className="font-display font-bold text-base text-obsidian dark:text-canvas">
            Mide&apos;s Beauty World
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-full hover:bg-canvas dark:hover:bg-darkHairline transition"
          >
            <X size={20} className="text-muted dark:text-darkMuted" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {[
            { label: 'Track Order', icon: MapPin, action: onTrack },
            { label: 'Contact & Call', icon: Phone, action: onContact },
            { label: 'About Brand', icon: Info, action: onAbout },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-obsidian dark:text-canvas hover:bg-canvas dark:hover:bg-darkHairline transition text-left"
            >
              <Icon size={18} className="text-muted dark:text-darkMuted" />
              {label}
            </button>
          ))}
        </nav>

        {/* Operational note */}
        <div className="px-5 py-4 border-t border-hairline dark:border-darkHairline">
          <p className="text-xs text-muted dark:text-darkMuted leading-relaxed">
            🏠 <strong className="text-obsidian dark:text-canvas">Hostel Deliveries:</strong>{' '}
            Mon – Sat (10:00 AM – 7:00 PM)
          </p>
        </div>
      </div>
    </>
  );
}
