/**
 * Injects Cloudinary's automatic format + quality transformation
 * into any Cloudinary upload URL, compressing photos to ~60KB WebP.
 */
export function cloudinaryOptimize(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

/**
 * Generates the full WhatsApp deep-link URL for a direct impulse-buy.
 */
export function generateProductWhatsAppUrl(product, selectedSize) {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';
  const activePrice = product.salePrice || product.price;
  const sizeStr = selectedSize ? ` (Size: ${selectedSize})` : '';
  const message = `Hi Mide, I want to order ${product.title}${sizeStr} for ₦${activePrice.toLocaleString()}. Is this available for delivery today?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the WhatsApp restock inquiry URL.
 */
export function generateRestockWhatsAppUrl(product) {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';
  const message = `Hi Mide, I saw that ${product.title} is sold out. Please let me know when you restock this item!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the WhatsApp waitlist URL for reserved items.
 */
export function generateWaitlistWhatsAppUrl(product) {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';
  const message = `Hi Mide, I see ${product.title} is currently reserved. If the buyer doesn't complete payment, please let me know—I'm ready to buy!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the full WhatsApp order slip URL for multi-item cart checkout.
 * Includes auto-embedded bank transfer details.
 */
export function generateWhatsAppOrderUrl(cart, fulfillmentMethod, studentDetails, subtotal, storeConfig) {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';
  const deliveryFee = storeConfig?.deliveryFee ?? 500;
  const finalFee = fulfillmentMethod === 'pickup' ? 0 : deliveryFee;
  const grandTotal = subtotal + finalFee;

  let message = `🛍️ *NEW ORDER - MIDE'S BEAUTY WORLD*\n`;
  message += `------------------------------------\n`;
  message += `*Student Name:* ${studentDetails.name || 'Campus Customer'}\n`;

  if (fulfillmentMethod === 'room') {
    message += `*Fulfillment:* Hostel Room Delivery (+₦${deliveryFee.toLocaleString()})\n`;
    message += `*Delivery Location:* ${studentDetails.hostelName || 'Hostel'}, Room ${studentDetails.roomNumber || 'N/A'}\n`;
  } else if (fulfillmentMethod === 'landmark') {
    message += `*Fulfillment:* Campus Landmark Meetup (+₦${deliveryFee.toLocaleString()})\n`;
    message += `*Meetup Point:* ${studentDetails.landmark || 'Main Campus Gate'}\n`;
  } else {
    message += `*Fulfillment:* Self-Pickup at Mide's Hostel (Free - ₦0)\n`;
  }

  message += `------------------------------------\n`;
  message += `*Order Items:*\n`;
  cart.forEach((item, index) => {
    const sizeStr = item.selectedSize ? ` (Size: ${item.selectedSize})` : '';
    const itemTotal = (item.salePrice || item.price) * item.quantity;
    message += `${index + 1}. ${item.title}${sizeStr} x${item.quantity} - ₦${itemTotal.toLocaleString()}\n`;
  });

  message += `------------------------------------\n`;
  message += `*Subtotal:* ₦${subtotal.toLocaleString()}\n`;
  message += `*Delivery Fee:* ₦${finalFee.toLocaleString()}\n`;
  message += `*Grand Total:* ₦${grandTotal.toLocaleString()}\n`;

  // Auto-Embedded Bank Transfer Block
  if (storeConfig?.bankDetails?.accountNumber) {
    message += `------------------------------------\n`;
    message += `💳 *Fast Bank Transfer Details:*\n`;
    message += `*Bank:* ${storeConfig.bankDetails.bankName}\n`;
    message += `*Account:* ${storeConfig.bankDetails.accountNumber}\n`;
    message += `*Name:* ${storeConfig.bankDetails.accountName}\n`;
    message += `_(Please send your payment receipt screenshot here after transfer)_\n`;
  }

  if (storeConfig?.lectureMode) {
    message += `\n📚 _Note: I see Lecture Mode is active; I'll await your reply once class is over!_\n`;
  }

  message += `\nHi Mide, I am ready to confirm this order. Are these items available for delivery today?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Silent non-blocking telemetry ping.
 */
export function telemetryPing(endpoint, payload = {}) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  fetch(`${base}/telemetry/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
