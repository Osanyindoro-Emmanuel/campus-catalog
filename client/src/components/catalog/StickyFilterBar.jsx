import { useRef, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useStoreConfig } from '../../context/StoreConfigContext';
import { DEFAULT_CATEGORIES } from '../../utils/categories';

const SORT_OPTIONS = [
  { key: 'popular', label: 'Most Popular' },
  { key: 'newest', label: 'Newest First' },
  { key: 'price-low', label: 'Price: Low → High' },
  { key: 'price-high', label: 'Price: High → Low' },
];

export default function StickyFilterBar() {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, sortBy, setSortBy } = useCatalog();
  const { storeConfig } = useStoreConfig();
  const categories = [
    { key: 'all', label: 'All' },
    ...(storeConfig?.categories?.length ? storeConfig.categories : DEFAULT_CATEGORIES),
  ];
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);
  const searchRef = useRef(null);

  // Inactive pill classes — explicit hex values so dark mode works in Tailwind v4
  const inactivePill =
    'bg-white/80 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-black/10 dark:border-white/10';

  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 dark:bg-[#121110]/95 backdrop-blur-md border-b border-neutral-200/70 dark:border-neutral-800 shadow-xs pt-1 pb-2">
        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 py-2 flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5
                         pl-8 pr-7 py-1.5 text-xs w-full focus:border-[#D48B77] focus:outline-none
                         text-neutral-900 dark:text-neutral-100
                         placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-center overflow-x-auto no-scrollbar">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-none px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeCategory === key
                    ? 'bg-[#C07052] text-white shadow-xs'
                    : inactivePill
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setDesktopSortOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition whitespace-nowrap"
            >
              Sort: {SORT_OPTIONS.find((o) => o.key === sortBy)?.label} ⌄
            </button>
            {desktopSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDesktopSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#181716] border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-20 py-1 min-w-[170px]">
                  {SORT_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setDesktopSortOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition hover:bg-neutral-50 dark:hover:bg-white/5 ${
                        sortBy === key ? 'font-semibold text-[#D48B77]' : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden">
          {/* Top search strip */}
          <div className="px-4 pt-2 pb-1.5 relative">
            <Search size={14} className="absolute left-7 top-1/2 -translate-y-0.5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search campus styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 dark:border-white/10
                         bg-white/80 dark:bg-white/5 pl-8 pr-8 py-1.5 text-xs
                         focus:border-[#D48B77] focus:outline-none
                         text-neutral-900 dark:text-neutral-100
                         placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-7 top-1/2 -translate-y-0.5 text-neutral-400 dark:text-neutral-500"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Pill carousel + sort button */}
          <div className="flex items-center gap-1.5 px-4 pb-2">
            <div className="flex-1 scroll-fade-right overflow-hidden">
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto pr-3">
                {categories.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex-none px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeCategory === key
                        ? 'bg-[#C07052] text-white shadow-xs'
                        : inactivePill
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Sort trigger */}
            <button
              onClick={() => setSortSheetOpen(true)}
              aria-label="Sort options"
              className="flex-none p-1.5 rounded-full border border-black/10 dark:border-white/10
                         bg-white/80 dark:bg-white/10 text-neutral-500 dark:text-neutral-400
                         hover:text-neutral-900 dark:hover:text-white transition"
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Bottom Sheet */}
      {sortSheetOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setSortSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#181716] rounded-t-2xl shadow-xl animate-slideUp">
            <div className="p-4 pb-8">
              <div className="w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-4" />
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 px-1">Sort By</p>
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setSortBy(key); setSortSheetOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs transition hover:bg-neutral-50 dark:hover:bg-white/5 ${
                    sortBy === key ? 'font-semibold text-[#D48B77]' : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {label}
                  {sortBy === key && <span className="w-2 h-2 rounded-full bg-[#D48B77]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
