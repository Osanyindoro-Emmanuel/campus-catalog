import { X, Trash2, Plus, Minus, Home, MapPin, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStoreConfig } from '../../context/StoreConfigContext';
import { generateWhatsAppOrderUrl, telemetryPing } from '../../utils/helpers';

const FULFILLMENT_OPTIONS = [
  {
    key: 'pickup',
    icon: Home,
    label: 'Hostel Pickup',
    subLabel: 'Handoff directly at Mide\'s hostel room / block.',
    feeLabel: 'Free - ₦0',
  },
  {
    key: 'room',
    icon: Truck,
    label: 'Hostel Room Delivery',
    subLabel: "Doorstep delivery to your dorm room.",
    feeLabel: null, // dynamic
  },
  {
    key: 'landmark',
    icon: MapPin,
    label: 'Campus Landmark / Gate Meetup',
    subLabel: 'Meetup at Main Gate, Faculty Complexes, or Student Union.',
    feeLabel: null, // dynamic
  },
];

export default function ShoppingBagDrawer() {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    fulfillmentMethod,
    setFulfillmentMethod,
    studentDetails,
    setStudentDetails,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCart();

  const { storeConfig } = useStoreConfig();
  const deliveryFee = storeConfig?.deliveryFee ?? 500;
  const finalFee = fulfillmentMethod === 'pickup' ? 0 : deliveryFee;
  const grandTotal = subtotal + finalFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    telemetryPing('checkout', { grandTotal, fulfillmentMethod, itemCount: cart.length });
    const url = generateWhatsAppOrderUrl(cart, fulfillmentMethod, studentDetails, subtotal, storeConfig);
    window.open(url, '_blank');
    setIsDrawerOpen(false);
  };

  const updateDetail = (field, value) => {
    setStudentDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-surface dark:bg-darkSurface shadow-floating flex flex-col transform transition-transform duration-350 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline dark:border-darkHairline flex-none">
          <div>
            <h2 className="font-display font-bold text-lg text-obsidian dark:text-canvas">
              Shopping Bag
            </h2>
            <p className="text-xs text-muted dark:text-darkMuted">
              {cart.length === 0 ? 'Your bag is empty' : `${cart.reduce((s, i) => s + i.quantity, 0)} item(s)`}
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-canvas dark:hover:bg-darkHairline transition"
          >
            <X size={20} className="text-muted dark:text-darkMuted" />
          </button>
        </div>

        {/* ── Lecture mode notice ── */}
        {storeConfig?.inLectureMode && (
          <div className="mx-5 mt-4 flex items-start gap-2 bg-status-reservedFill text-status-reservedText text-xs font-medium px-4 py-3 rounded-xl border border-amber-200">
            <AlertCircle size={14} className="mt-0.5 flex-none" />
            {storeConfig?.lectureModeMessage}
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Empty state */}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-sm font-medium text-obsidian dark:text-canvas">Your bag is empty</p>
              <p className="text-xs text-muted dark:text-darkMuted mt-1">Browse the catalog and add items to get started</p>
            </div>
          )}

          {/* Cart items */}
          {cart.map((item) => (
            <div key={item.cartItemId} className="flex gap-3 bg-canvas dark:bg-obsidian rounded-xl p-3 border border-hairline dark:border-darkHairline">
              {/* Thumbnail */}
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-hairline dark:bg-darkHairline flex-none">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-obsidian dark:text-canvas leading-tight line-clamp-2">
                  {item.title}
                </p>
                {item.selectedSize && (
                  <span className="inline-block mt-1 text-xs bg-surface dark:bg-darkSurface border border-hairline dark:border-darkHairline px-2 py-0.5 rounded text-muted dark:text-darkMuted">
                    Size: {item.selectedSize}
                  </span>
                )}
                <p className="text-sm font-bold text-obsidian dark:text-canvas mt-1">
                  ₦{((item.salePrice || item.price) * item.quantity).toLocaleString()}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="w-7 h-7 rounded-full border border-hairline dark:border-darkHairline flex items-center justify-center hover:border-obsidian dark:hover:border-white transition"
                  >
                    <Minus size={12} className="text-obsidian dark:text-canvas" />
                  </button>
                  <span className="text-sm font-semibold text-obsidian dark:text-canvas w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="w-7 h-7 rounded-full border border-hairline dark:border-darkHairline flex items-center justify-center hover:border-obsidian dark:hover:border-white transition"
                  >
                    <Plus size={12} className="text-obsidian dark:text-canvas" />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="ml-auto p-1.5 rounded-full hover:bg-status-soldOutFill transition"
                  >
                    <Trash2 size={14} className="text-status-soldOutText" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* ── Fulfillment Selector ── */}
          {cart.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted dark:text-darkMuted uppercase tracking-wider mb-3">
                Fulfillment Method
              </p>
              <div className="space-y-2">
                {FULFILLMENT_OPTIONS.map(({ key, icon: Icon, label, subLabel, feeLabel }) => {
                  const fee = feeLabel ?? `+₦${deliveryFee.toLocaleString()}`;
                  return (
                    <button
                      key={key}
                      onClick={() => setFulfillmentMethod(key)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border transition text-left ${
                        fulfillmentMethod === key
                          ? 'border-accent-terracotta bg-accent-terracotta/5'
                          : 'border-hairline dark:border-darkHairline hover:border-obsidian dark:hover:border-white'
                      }`}
                    >
                      {/* Radio dot */}
                      <span className={`w-4 h-4 rounded-full border-2 flex-none mt-0.5 flex items-center justify-center transition ${
                        fulfillmentMethod === key ? 'border-accent-terracotta' : 'border-hairline dark:border-darkHairline'
                      }`}>
                        {fulfillmentMethod === key && (
                          <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-obsidian dark:text-canvas flex items-center gap-1.5">
                            <Icon size={14} />
                            {label}
                          </span>
                          <span className={`text-xs font-semibold flex-none ${
                            key === 'pickup' ? 'text-accent-emerald' : 'text-muted dark:text-darkMuted'
                          }`}>
                            {fee}
                          </span>
                        </div>
                        <p className="text-xs text-muted dark:text-darkMuted mt-0.5">{subLabel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Dynamic persisted form fields ── */}
              <div className="mt-4 space-y-3">
                {/* All modes: Name */}
                <div>
                  <label className="block text-xs font-medium text-muted dark:text-darkMuted mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aisha Bello"
                    value={studentDetails.name}
                    onChange={(e) => updateDetail('name', e.target.value)}
                    className="w-full rounded-xl border border-hairline dark:border-darkHairline bg-canvas dark:bg-obsidian px-3 py-2.5 text-sm text-obsidian dark:text-canvas placeholder:text-muted dark:placeholder:text-darkMuted focus:border-accent-terracotta focus:outline-none"
                  />
                </div>

                {/* Mode 2: Hostel Room Delivery */}
                {fulfillmentMethod === 'room' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-muted dark:text-darkMuted mb-1">
                        Hostel Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Murtala Hostel / Aisha Hall"
                        value={studentDetails.hostelName}
                        onChange={(e) => updateDetail('hostelName', e.target.value)}
                        className="w-full rounded-xl border border-hairline dark:border-darkHairline bg-canvas dark:bg-obsidian px-3 py-2.5 text-sm text-obsidian dark:text-canvas placeholder:text-muted dark:placeholder:text-darkMuted focus:border-accent-terracotta focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted dark:text-darkMuted mb-1">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Block C, Room 14"
                        value={studentDetails.roomNumber}
                        onChange={(e) => updateDetail('roomNumber', e.target.value)}
                        className="w-full rounded-xl border border-hairline dark:border-darkHairline bg-canvas dark:bg-obsidian px-3 py-2.5 text-sm text-obsidian dark:text-canvas placeholder:text-muted dark:placeholder:text-darkMuted focus:border-accent-terracotta focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Mode 3: Landmark Meetup */}
                {fulfillmentMethod === 'landmark' && (
                  <div>
                    <label className="block text-xs font-medium text-muted dark:text-darkMuted mb-1">
                      Landmark / Faculty Description *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Gate, Faculty of Arts Building"
                      value={studentDetails.landmark}
                      onChange={(e) => updateDetail('landmark', e.target.value)}
                      className="w-full rounded-xl border border-hairline dark:border-darkHairline bg-canvas dark:bg-obsidian px-3 py-2.5 text-sm text-obsidian dark:text-canvas placeholder:text-muted dark:placeholder:text-darkMuted focus:border-accent-terracotta focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer: Totals + Checkout ── */}
        {cart.length > 0 && (
          <div className="flex-none border-t border-hairline dark:border-darkHairline px-5 py-4 space-y-3">
            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted dark:text-darkMuted">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted dark:text-darkMuted">
                <span>Delivery Fee</span>
                <span className={finalFee === 0 ? 'text-accent-emerald font-medium' : ''}>
                  {finalFee === 0 ? 'Free' : `₦${finalFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-obsidian dark:text-canvas pt-1.5 border-t border-hairline dark:border-darkHairline">
                <span>Grand Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-accent-emerald hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-xl transition active:scale-95"
            >
              💬 Finalize Order on WhatsApp
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-xs text-muted dark:text-darkMuted hover:text-status-soldOutText transition text-center"
            >
              Clear bag
            </button>
          </div>
        )}
      </div>
    </>
  );
}

