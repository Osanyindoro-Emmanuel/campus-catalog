import { useState, useCallback } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cloudinaryOptimize, generateProductWhatsAppUrl, generateRestockWhatsAppUrl, generateWaitlistWhatsAppUrl, telemetryPing } from '../../utils/helpers';
import ImageLightbox from '../ui/ImageLightbox';

export default function ProductCard({ product }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const { addToCart } = useCart();

  const {
    _id,
    title,
    category,
    price,
    salePrice,
    status,
    sizes = [],
    imageUrl,
    description,
  } = product;

  const optimizedImage = cloudinaryOptimize(imageUrl);
  const activePrice = salePrice || price;
  const discountPct = salePrice ? Math.round(((price - salePrice) / price) * 100) : null;
  const isLive = status === 'live';
  const isSoldOut = status === 'sold_out';
  const isReserved = status === 'reserved';
  const availableSizes = Array.isArray(sizes) ? sizes.filter(Boolean) : [];
  const whatsappButtonClass = 'w-full sm:w-auto justify-center rounded-full py-1.5 px-2 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 sm:gap-1.5 shadow-sm mx-auto transition active:scale-95';
  const quickOrderButtonClass = 'min-w-0 flex-1 justify-center rounded-full py-1.5 px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition active:scale-95 whitespace-nowrap';

  // Handle WhatsApp direct order (uses default size or onesize)
  const handleWhatsAppOrder = useCallback(() => {
    telemetryPing('wa_click_pdp', {
      id: _id,
      title,
      price: activePrice,
      size: sizes[0] || 'onesize',
    });
    const url = generateProductWhatsAppUrl({
      title,
      price: activePrice,
      size: sizes[0] || null,
      id: _id,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [_id, title, activePrice, sizes]);

  // Handle Waitlist (reserved)
  const handleWaitlist = useCallback(() => {
    const url = generateWaitlistWhatsAppUrl(product, sizes[0] || null);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [product, sizes]);

  // Handle Restock Inquiry (sold out)
  const handleRestockInquiry = useCallback(() => {
    const url = generateRestockWhatsAppUrl(product);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [product]);

  const handleAddToBag = () => {
    if (availableSizes.length > 1) {
      setSizePickerOpen(true);
      return;
    }
    addToCart(product, availableSizes[0] || null);
  };

  const handleAddSelectedSize = (size) => {
    addToCart(product, size);
    setSizePickerOpen(false);
  };

  return (
    <>
      <article
        id={`product-${_id}`}
        className="rounded-2xl p-3 bg-white dark:bg-[#1E1D1B] border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-floating transition-shadow duration-200 group"
      >
        {/* Square images fill the frame; portrait images stay whole over a blurred image backdrop. */}
        <div
          className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5 relative mb-2 cursor-zoom-in isolate"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={imgError ? 'https://placehold.co/400x300/F9F9F8/555555?text=No+Image' : optimizedImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-55"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20" aria-hidden="true" />
          <img
            src={imgError ? 'https://placehold.co/400x300/F9F9F8/555555?text=No+Image' : optimizedImage}
            alt={title}
            onError={() => setImgError(true)}
            className="relative z-10 w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* ── Status Badges (Top Right, matching mockup) ── */}
        </div>

        {/* ── Product Info & Clean Action ── */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            {/* Title */}
            <h3 className="text-xs sm:text-sm font-semibold truncate mt-1 text-neutral-900 dark:text-neutral-100 leading-snug">
              {title}
            </h3>

            {/* Pricing */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                ₦{activePrice.toLocaleString()}
              </span>
              {salePrice && (
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 line-through">
                  ₦{price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="mt-2 min-h-5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {isLive && (
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/70 uppercase tracking-wider shadow-xs whitespace-nowrap">
                    In Stock
                  </span>
                )}
                {isReserved && (
                  <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200/70 uppercase tracking-wider shadow-xs whitespace-nowrap">
                    Reserved
                  </span>
                )}
                {isSoldOut && (
                  <span className="bg-rose-50 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-200/70 uppercase tracking-wider shadow-xs whitespace-nowrap">
                    Sold Out
                  </span>
                )}
              </div>
              {discountPct > 0 && (
                <span className="bg-[#D48B77] text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  {discountPct}% OFF
                </span>
              )}
            </div>
          </div>

          {/* ── Centered Rounded WhatsApp / Status Pill (No size selector, no trailing square) ── */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {/* State 1: Live */}
            {isLive && (
              <>
                <button
                  onClick={handleWhatsAppOrder}
                  className={quickOrderButtonClass}
                >
                  <MessageCircle size={12} className="flex-none" />
                  <span className="sm:hidden">Order</span>
                  <span className="hidden sm:inline">Order via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToBag}
                  aria-label={`Add ${title} to shopping bag`}
                  title="Add to bag"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 dark:border-white/15 dark:bg-[#1E1D1B] dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Plus size={17} strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* State 2: Reserved */}
            {isReserved && (
              <button
                onClick={handleWaitlist}
                className={whatsappButtonClass}
              >
                <MessageCircle size={13} />
                <span>Inquire via WhatsApp</span>
              </button>
            )}

            {/* State 3: Sold Out */}
            {isSoldOut && (
              <button
                onClick={handleRestockInquiry}
                className={whatsappButtonClass}
              >
                <MessageCircle size={13} className="flex-shrink-0" />
                <span>Ask About Availability</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Tap-to-zoom lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          imageUrl={optimizedImage}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {sizePickerOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-3 sm:items-center"
          onClick={() => setSizePickerOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`size-picker-title-${_id}`}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-[#1E1D1B]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={`size-picker-title-${_id}`} className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Choose a size
            </h2>
            <p className="mt-1 truncate text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAddSelectedSize(size)}
                  className="min-h-11 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 dark:border-white/15 dark:text-neutral-100 dark:hover:border-white/50 dark:hover:bg-white/5"
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSizePickerOpen(false)}
              className="mt-4 w-full rounded-xl py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </section>
        </div>
      )}
    </>
  );
}
