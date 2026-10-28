import { useCatalog } from '../../context/CatalogContext';

// ─── Per-Category Hero Configurations ─────────────────────────────────────────
const HERO_CONFIG = {
  all: {
    key: 'all',
    badge: '✨ Campus Edit',
    headline: ['YOUR CAMPUS', 'FAVOURITES'],
    showStar: true,
    subtitle: 'STUDIO / UNISEX WARDROBE',
    bg: 'bg-[#F1E8DF] dark:bg-[#1E1D1B]',
    blob: 'bg-[#E8C9A0]/40 dark:bg-[#E8C9A0]/10',
    showCta: false,
    ctaText: 'Discover',
  },
  clothing: {
    key: 'clothing',
    badge: '👕 Fresh Drops',
    headline: ['CAMPUS THREADS', '& HOODIES'],
    showStar: false,
    subtitle: 'STUDIO / STREETWEAR & BASIC TEES',
    bg: 'bg-[#F5ECE3] dark:bg-[#1E1D1B]',
    blob: 'bg-amber-300/30 dark:bg-amber-400/10',
    showCta: true,
    ctaText: 'Explore Styles',
  },
  footwear: {
    key: 'footwear',
    badge: '👟 Trending Kicks',
    headline: ['STEP OUT IN', 'THE LEAD'],
    showStar: false,
    subtitle: 'Luxury campus kicks meets everyday hostel comfort',
    bg: 'bg-[#FDEEDF] dark:bg-[#1E1D1B]',
    blob: 'bg-amber-300/30 dark:bg-amber-400/10',
    showCta: true,
    ctaText: 'Discover',
    thumbnails: ['/footwear-hero.png', '/student1.png', '/footwear-hero.png'],
  },
  bags: {
    key: 'bags',
    badge: '🎒 Lecture Ready',
    headline: ['CAMPUS BACKPACKS', '& TOTES'],
    showStar: false,
    subtitle: 'STUDIO / LAPTOP BAGS & CROSSBODIES',
    bg: 'bg-[#E8F1EC] dark:bg-[#161C18]',
    blob: 'bg-emerald-300/30 dark:bg-emerald-400/10',
    showCta: true,
    ctaText: 'View Bags',
  },
  jewelry: {
    key: 'jewelry',
    badge: '✨ Trending Accs',
    headline: ['CAMPUS ACCS', '& TIMEPIECES'],
    showStar: false,
    subtitle: 'STUDIO / CHAINS, RINGS & WATCHES',
    bg: 'bg-[#F4EFE6] dark:bg-[#1C1A14]',
    blob: 'bg-[#D4C498]/30 dark:bg-[#D4C498]/10',
    showCta: true,
    ctaText: 'Discover Accs',
  },
};

// ─── Shared White Die-Cut Sticker Filter ──────────────────────────────────────
const STICKER_FILTER = {
  filter:
    'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 0 2.5px #ffffff) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))',
};

// ─── Gold Star SVG Badge ──────────────────────────────────────────────────────
function GoldStarBadge() {
  return (
    <>
      <span
        className="inline-block w-4 h-2.5 ml-0.5 align-middle bg-[#F2C542] rounded-b-[9px] rounded-t-[2px] -rotate-6 shadow-[0_1px_2px_rgba(98,68,20,0.32)] border border-amber-300/40 flex-shrink-0 lg:hidden"
        aria-hidden="true"
      />
      <span
        className="hidden lg:inline-block w-8 h-5 ml-2.5 align-middle bg-[#F2C542] rounded-b-[18px] rounded-t-[4px] -rotate-6 shadow-[0_2px_3px_rgba(98,68,20,0.32)] border border-amber-300/40 flex-shrink-0"
        title="Campus sticker"
        aria-hidden="true"
      />
    </>
  );
}

// ─── Default Homepage Graphic: 4 Students with Natural Overlap & Sticker Outline ─
function HomepageStudentsGraphic({ blob, compact = false }) {
  return (
    <div className={compact
      ? 'relative flex items-end justify-end w-full h-full overflow-visible'
      : 'relative flex items-end justify-end w-full h-full pr-2 sm:pr-4 pb-0 max-h-[210px] lg:h-full lg:max-h-none lg:self-end lg:pr-0'}>
      {/* Ambient atmospheric glow blob */}
      <div
        className={`absolute bottom-0 right-1/4 w-52 h-24 rounded-full blur-2xl pointer-events-none ${compact ? 'hidden' : ''} ${blob || 'bg-[#E8C9A0]/40 dark:bg-[#E8C9A0]/10'}`}
        aria-hidden="true"
      />
      {/* Ground shadow ellipse */}
      <div
        className={`absolute bottom-0 right-4 w-64 h-2.5 rounded-full bg-black/10 dark:bg-black/30 blur-md pointer-events-none ${compact ? 'hidden' : ''}`}
        aria-hidden="true"
      />
      {/* 4-student cluster with natural shoulder overlap & crisp white sticker outline */}
      <div
        className={`relative z-10 flex items-end justify-start ${compact ? '-space-x-6 -translate-x-5 translate-y-1' : '-space-x-3 sm:-space-x-4 lg:-space-x-5'}`}
        style={STICKER_FILTER}
      >
        <img
          src="/student1.png"
          alt="Student in blue shirt"
          className={`${compact ? 'h-[88px] sm:h-[100px] md:h-36' : 'h-36 sm:h-44 lg:h-[210px]'} w-auto object-contain object-bottom z-10 select-none pointer-events-none translate-y-1`}
          draggable="false"
        />
        <img
          src="/student2.png"
          alt="Student in denim overalls"
          className={`${compact ? 'h-[88px] sm:h-[100px] md:h-42' : 'h-42 sm:h-50 lg:h-[210px]'} w-auto object-contain object-bottom z-30 select-none pointer-events-none translate-y-1`}
          draggable="false"
        />
        <img
          src="/student3.png"
          alt="Student in brown shirt"
          className={`${compact ? 'h-[88px] sm:h-[100px] md:h-40' : 'h-40 sm:h-48 lg:h-[210px]'} w-auto object-contain object-bottom z-20 select-none pointer-events-none translate-y-1`}
          draggable="false"
        />
        <img
          src="/student4.png"
          alt="Student in orange top"
          className={`${compact ? 'h-[88px] sm:h-[100px] md:h-34 translate-x-2' : 'h-34 sm:h-42 lg:h-[210px]'} w-auto object-contain object-bottom z-10 select-none pointer-events-none translate-y-1`}
          draggable="false"
        />
      </div>
    </div>
  );
}

// ─── Footwear Dedicated Graphic ───────────────────────────────────────────────
function FootwearGraphic({ blob }) {
  return (
    <div className="relative flex items-end justify-center md:justify-end w-full h-full pr-4 sm:pr-8 pb-0 max-h-[210px] overflow-visible">
      {/* Ambient radial blur blob behind sneakers */}
      <div
        className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none ${blob || 'bg-amber-300/30 dark:bg-amber-400/10'}`}
        aria-hidden="true"
      />
      {/* Soft ground shadow ellipse */}
      <div
        className="absolute bottom-0 right-6 sm:right-10 w-44 h-2.5 rounded-full bg-black/10 dark:bg-black/30 blur-md pointer-events-none"
        aria-hidden="true"
      />
      <img
        src="/footwear-hero.png"
        alt="Campus sneakers collection"
        className="relative h-36 sm:h-42 lg:h-46 object-contain object-bottom select-none pointer-events-none filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)]"
        draggable="false"
      />
    </div>
  );
}

// ─── Clothing Dedicated Graphic ───────────────────────────────────────────────
function ClothingGraphic({ blob }) {
  return (
    <div className="relative flex items-end justify-center md:justify-end w-full h-full pr-3 sm:pr-6 pb-0 max-h-[210px] overflow-visible">
      <div
        className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none ${blob || 'bg-amber-300/30 dark:bg-amber-400/10'}`}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-6 w-48 h-2.5 rounded-full bg-black/10 dark:bg-black/30 blur-md pointer-events-none"
        aria-hidden="true"
      />
      {/* Transparent Streetwear Fashion Duo with White Die-Cut Sticker Outline */}
      <div className="flex items-end justify-end -space-x-3 sm:-space-x-4">
        <img
          src="/student2.png"
          alt="Campus denim dungarees streetwear"
          className="h-38 sm:h-46 object-contain object-bottom z-20 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
        <img
          src="/student3.png"
          alt="Campus brown overshirt jacket fit"
          className="h-40 sm:h-48 object-contain object-bottom z-10 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
      </div>
    </div>
  );
}

// ─── Bags Dedicated Graphic ───────────────────────────────────────────────────
function BagsGraphic({ blob }) {
  return (
    <div className="relative flex items-end justify-center md:justify-end w-full h-full pr-3 sm:pr-6 pb-0 max-h-[210px] overflow-visible">
      <div
        className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none ${blob || 'bg-emerald-300/30 dark:bg-emerald-400/10'}`}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-6 w-48 h-2.5 rounded-full bg-black/10 dark:bg-black/30 blur-md pointer-events-none"
        aria-hidden="true"
      />
      {/* Transparent Campus Bags Duo with White Die-Cut Sticker Outline */}
      <div className="flex items-end justify-end -space-x-3 sm:-space-x-4">
        <img
          src="/student1.png"
          alt="Student with campus books and bag"
          className="h-38 sm:h-46 object-contain object-bottom z-20 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
        <img
          src="/student4.png"
          alt="Student with lecture tote"
          className="h-36 sm:h-44 object-contain object-bottom z-10 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
      </div>
    </div>
  );
}

// ─── Jewelry Dedicated Graphic ────────────────────────────────────────────────
function JewelryGraphic({ blob }) {
  return (
    <div className="relative flex items-end justify-center md:justify-end w-full h-full pr-3 sm:pr-6 pb-0 max-h-[210px] overflow-visible">
      <div
        className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none ${blob || 'bg-[#D4C498]/30 dark:bg-[#D4C498]/10'}`}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-6 w-48 h-2.5 rounded-full bg-black/10 dark:bg-black/30 blur-md pointer-events-none"
        aria-hidden="true"
      />
      {/* Transparent Campus Accessories Duo with White Die-Cut Sticker Outline */}
      <div className="flex items-end justify-end -space-x-3 sm:-space-x-4">
        <img
          src="/student4.png"
          alt="Campus accessories and styling"
          className="h-36 sm:h-44 object-contain object-bottom z-20 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
        <img
          src="/student1.png"
          alt="Campus timepiece styling"
          className="h-38 sm:h-46 object-contain object-bottom z-10 select-none pointer-events-none"
          style={STICKER_FILTER}
          draggable="false"
        />
      </div>
    </div>
  );
}

// ─── Main Dynamic Spotlight Hero Component ────────────────────────────────────
const DynamicSpotlightHero = () => {
  const { activeCategory: contextCategory } = useCatalog();

  // Safely normalize category name: prioritizes context state, falls back to URL search param
  const rawCat = (
    contextCategory ||
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('category') : 'all') ||
    'all'
  )
    .toLowerCase()
    .trim();
  const isAllCategory = rawCat === 'all';

  let normalizedCategory = 'all';
  if (rawCat === 'clothing' || rawCat === 'clothes' || rawCat === 'apparel') {
    normalizedCategory = 'clothing';
  } else if (rawCat === 'footwear' || rawCat === 'shoes' || rawCat === 'kicks') {
    normalizedCategory = 'footwear';
  } else if (rawCat === 'bags' || rawCat === 'bag' || rawCat === 'backpacks') {
    normalizedCategory = 'bags';
  } else if (
    rawCat === 'jewelry' ||
    rawCat === 'jewelry & accs' ||
    rawCat === 'accessories' ||
    rawCat === 'accs'
  ) {
    normalizedCategory = 'jewelry';
  } else {
    normalizedCategory = 'all';
  }

  // Guaranteed fallback — never null or undefined
  const config = HERO_CONFIG[normalizedCategory] || HERO_CONFIG.all;

  const scrollToCatalog = () => {
    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Strict compact height constraints ensuring product card row 1 stays visible above the fold
  const containerHeightClass = isAllCategory
    ? 'min-h-[128px] max-h-[140px] sm:min-h-[144px] sm:max-h-[156px] md:min-h-[190px] md:max-h-[215px] lg:min-h-[190px] lg:max-h-[220px]'
    : 'min-h-[190px] max-h-[215px] lg:min-h-[190px] lg:max-h-[220px]';

  const badgeStr = config.badge || '✨ New Drops';
  const badgeParts = badgeStr.split(' ');
  const badgeEmoji = badgeParts[0] || '✨';
  const badgeText = badgeParts.slice(1).join(' ') || 'New Drops';

  const headlineParts =
    Array.isArray(config.headline) && config.headline.length >= 2
      ? config.headline
      : [config.headline?.[0] || 'YOUR CAMPUS', config.headline?.[1] || 'FAVOURITES'];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isAllCategory ? 'mt-1 mb-2 md:my-4 lg:mt-0' : 'my-4 lg:mt-0'}`}>
      <div
        className={`${config.bg} ${isAllCategory ? 'mt-0 mb-1 md:my-3 p-2 md:p-5 rounded-2xl sm:rounded-3xl' : 'my-2.5 sm:my-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl'} overflow-hidden shadow-xs relative
                    mx-auto w-full max-w-5xl
                    lg:my-0 lg:px-8 lg:py-1 lg:rounded-3xl lg:overflow-hidden lg:bg-[#F1E5D8] lg:shadow-none ${containerHeightClass}`}
      >
        <div className={`grid ${isAllCategory ? 'grid-cols-[minmax(0,1fr)_minmax(112px,0.82fr)] items-center gap-1 md:grid-cols-12 md:gap-0' : 'grid-cols-1 md:grid-cols-12'} lg:grid lg:grid-cols-[max-content_minmax(0,1fr)] lg:items-center lg:gap-3 ${containerHeightClass}`}>

          {/* ── Left Column: 5 Cols for headline, badge, subtitle, & CTA ── */}
          <div className={`${isAllCategory ? 'min-w-0 p-1 sm:p-2 md:p-5 translate-y-1.5 md:translate-y-0' : 'md:col-span-5 p-3 sm:p-5'} flex flex-col justify-center items-start z-10 self-center md:col-span-5 lg:col-span-1 lg:w-auto lg:p-0`}>
            {/* Pill Badge */}
            <div
              className={`${isAllCategory ? 'hidden md:hidden' : 'inline-flex'} items-center gap-1.5 px-3 py-0.5 rounded-full
                         bg-white/70 dark:bg-neutral-800/80 backdrop-blur-sm
                         text-[11px] font-semibold text-neutral-800 dark:text-neutral-200
                         mb-1.5 border border-black/5 dark:border-white/5 lg:hidden`}
            >
              <span>{badgeEmoji}</span>
              <span>{badgeText}</span>
            </div>

            {/* Headline */}
            <h1
              className={`${isAllCategory ? 'text-[clamp(20px,6.2vw,25px)] sm:text-[28px] md:text-2xl flex-col md:flex-row md:flex-wrap md:items-center md:gap-x-2' : 'text-xl sm:text-2xl flex-wrap gap-x-2'} font-black lg:text-6xl leading-tight mb-1
                         text-neutral-900 dark:text-white tracking-tight flex flex-wrap ${isAllCategory ? 'items-start' : 'items-center'} gap-x-2
                         lg:block lg:leading-[0.95] lg:uppercase lg:tracking-tight lg:text-[#3B3028] dark:lg:text-neutral-100`}
            >
              <span className={`${isAllCategory ? 'md:block' : 'lg:block'}`}>{headlineParts[0]}</span>
              <span className={`flex items-center ${isAllCategory ? 'gap-1 md:gap-1.5 lg:gap-0' : 'gap-1.5 lg:gap-0'}`}>
                {headlineParts[1]}
                {config.showStar && <GoldStarBadge />}
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`${isAllCategory ? 'text-[9px] tracking-[0.12em] mb-0 sm:text-xs md:text-[11px] md:tracking-wider md:mb-2.5' : 'text-[11px] sm:text-xs tracking-wider mb-2.5'} font-semibold text-neutral-500 dark:text-neutral-400 max-w-sm lg:mt-2 lg:mb-0 lg:text-sm lg:tracking-widest lg:uppercase lg:text-[#76695F] dark:lg:text-neutral-300`}>
              {config.subtitle}
            </p>

            {/* Actions: Pill CTA & Mini Swatches */}
            {config.showCta && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={scrollToCatalog}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                             bg-neutral-900 hover:bg-neutral-800
                             dark:bg-white dark:hover:bg-neutral-100
                             text-white dark:text-neutral-900
                             text-xs font-bold shadow-xs active:scale-95"
                >
                  <span>{config.ctaText || 'Discover'}</span>
                  <span aria-hidden="true">→</span>
                </button>

                {config.thumbnails && (
                  <div className="hidden sm:flex items-center gap-1">
                    {config.thumbnails.map((img, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-6 rounded-md bg-white/80 dark:bg-white/10 p-0.5 flex items-center justify-center border ${
                          idx === 0
                            ? 'border-amber-500 shadow-xs'
                            : 'border-black/5 dark:border-white/5 opacity-70'
                        }`}
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right Column: 7 Cols with comfortable breathing room & dedicated graphics ── */}
          {isAllCategory && (
            <div className="md:hidden min-w-0 flex items-end justify-end h-full overflow-visible">
              <HomepageStudentsGraphic blob={config.blob} compact />
            </div>
          )}

          <div className="md:col-span-7 hidden md:flex items-end justify-start pr-2 sm:pr-4 overflow-visible h-full lg:col-span-1 lg:w-auto lg:self-end lg:pr-0">
            {normalizedCategory === 'all' && <HomepageStudentsGraphic blob={config.blob} />}
            {normalizedCategory === 'footwear' && <FootwearGraphic blob={config.blob} />}
            {normalizedCategory === 'clothing' && <ClothingGraphic blob={config.blob} />}
            {normalizedCategory === 'bags' && <BagsGraphic blob={config.blob} />}
            {normalizedCategory === 'jewelry' && <JewelryGraphic blob={config.blob} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DynamicSpotlightHero;
