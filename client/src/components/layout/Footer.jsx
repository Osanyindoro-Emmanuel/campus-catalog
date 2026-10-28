export default function Footer({ onOpenAbout, onOpenContact, onOpenTrack }) {
  return (
    <footer className="bg-[#FAF7F2] dark:bg-[#121110] border-t border-black/5 dark:border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-base text-neutral-900 dark:text-neutral-100">
              Mide&apos;s Beauty World
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Campus delivery badge */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-white/5 border border-emerald-100 dark:border-white/10 px-4 py-2 rounded-full">
            <span className="text-sm">🎓</span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              UNIMAID Campus Delivery Available
            </span>
          </div>

          {/* Customer utility links — zero admin exposure */}
          <div className="flex items-center gap-5">
            {[
              { label: 'About', action: onOpenAbout },
              { label: 'Contact', action: onOpenContact },
              { label: 'Track Order', action: onOpenTrack },
            ].map(({ label, action }) => (
              <button
                key={label}
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                onClick={action}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Curated Unisex Streetwear, Kicks &amp; Accessories · Fast Hostel Delivery · University of Maiduguri
          </p>
        </div>
      </div>
    </footer>
  );
}
