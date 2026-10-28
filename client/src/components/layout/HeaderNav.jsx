import { useState } from 'react';
import { Sun, Moon, ShoppingBag, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import MobileUtilityDrawer from './MobileUtilityDrawer';

export default function HeaderNav({ onOpenTrack, onOpenContact, onOpenAbout }) {
  const { isDark, toggle } = useTheme();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const openFromMobileMenu = (openOverlay) => {
    setMobileDrawerOpen(false);
    openOverlay?.();
  };

  return (
    <>
      {/* Top Navbar Row: Comfortable padding and distinct stacked layout */}
      <header className="bg-white/90 dark:bg-[#181716]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 relative z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 pb-3.5 flex items-center justify-between min-h-[76px]">

          {/* ── MOBILE: Left hamburger ── */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90"
            >
              <Menu size={22} className="text-obsidian dark:text-canvas" />
            </button>
          </div>

          {/* ── DESKTOP: Left utility links ── */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { label: 'About', action: onOpenAbout },
              { label: 'Contact', action: onOpenContact },
              { label: 'Track Order', action: onOpenTrack },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* ── CENTER: Brand wordmark with crown (Fully contained, never overflows) ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="flex flex-col items-center gap-0.5 leading-none select-none">
              <span className="text-accent-gold text-sm md:text-base leading-none">👑</span>
              <span className="font-display font-bold tracking-tight text-base md:text-lg text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                MIDE&apos;S
              </span>
              <span className="font-display font-semibold tracking-widest text-[11px] md:text-xs text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                BEAUTY WORLD
              </span>
              <span className="text-[9px] font-medium tracking-widest text-neutral-500 dark:text-neutral-400 whitespace-nowrap uppercase">
                Studio · Unisex Wardrobe
              </span>
            </div>
          </div>

          {/* ── RIGHT: Theme toggle + Shopping bag ── */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90"
            >
              {isDark ? (
                <Sun
                  size={18}
                  className="text-amber-400"
                  style={{ transform: 'rotate(0deg)', transition: 'transform 200ms' }}
                />
              ) : (
                <Moon
                  size={18}
                  className="text-neutral-700"
                  style={{ transform: 'rotate(0deg)', transition: 'transform 200ms' }}
                />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90"
            >
              <ShoppingBag size={18} className="text-neutral-900 dark:text-neutral-100" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D48B77] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Slide-out Drawers & Modals */}
      <MobileUtilityDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onTrack={() => openFromMobileMenu(onOpenTrack)}
        onContact={() => openFromMobileMenu(onOpenContact)}
        onAbout={() => openFromMobileMenu(onOpenAbout)}
      />
    </>
  );
}
