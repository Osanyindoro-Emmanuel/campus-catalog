import { useState, useCallback } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cloudinaryOptimize, generateProductWhatsAppUrl, generateRestockWhatsAppUrl, generateWaitlistWhatsAppUrl, telemetryPing } from '../../utils/helpers';
import ImageLightbox from '../ui/ImageLightbox';

export default function ProductCard({ product }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  return (
    <>
      <article
        id={`product-${_id}`}
        className="rounded-2xl p-3 bg-white dark:bg-[#1E1D1B] border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-floating transition-all duration-200 group"
      >
        {/* ── Image Viewport (Aspect 4/3, Max-H 36-40) ── */}
        <div
          className="aspect-[4/3] max-h-36 sm:max-h-40 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5 relative mb-2 cursor-zoom-in flex items-center justify-center"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={imgError ? 'https://placehold.co/400x300/F9F9F8/555555?text=No+Image' : optimizedImage}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full max-h-36 sm:max-h-40 object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* ── Status Badges (Top Right, matching mockup) ── */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {isSoldOut && (
              <span className="bg-red-50 text-red-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-red-200/60 uppercase tracking-wider shadow-xs">
                Sold Out
              </span>
            )}
            {isReserved && (
              <span className="bg-amber-50 text-amber-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200/60 uppercase tracking-wider shadow-xs">
                Reserved
              </span>
            )}
            {isLive && discountPct && (
              <span className="bg-[#D48B77] text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                {discountPct}% OFF
              </span>
            )}
            {isLive && !discountPct && (
              <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wider shadow-xs">
                In Stock
              </span>
            )}
          </div>
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
          </div>

          {/* ── Centered Rounded WhatsApp / Status Pill (No size selector, no trailing square) ── */}
          <div className="mt-3 flex justify-center">
            {/* State 1: Live */}
            {isLive && (
              <button
                onClick={handleWhatsAppOrder}
                className="rounded-full py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm mx-auto transition active:scale-95"
              >
                <MessageCircle size={13} />
                <span>Order via WhatsApp</span>
              </button>
            )}

            {/* State 2: Reserved */}
            {isReserved && (
              <button
                onClick={handleWaitlist}
                className="rounded-full py-1.5 px-4 bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs mx-auto transition hover:opacity-85 active:scale-95"
              >
                <span>🟠 Reserved</span>
              </button>
            )}

            {/* State 3: Sold Out */}
            {isSoldOut && (
              <button
                onClick={handleRestockInquiry}
                className="rounded-full py-1.5 px-4 bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs mx-auto transition hover:opacity-85 active:scale-95"
              >
                <Bell size={12} />
                <span>Out of Stock</span>
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
    </>
  );
}
