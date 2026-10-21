import { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageLightbox({ imageUrl, title, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <X size={22} />
      </button>

      {/* Image — stop propagation so clicking image itself doesn't close */}
      <div
        className="relative max-w-lg w-full max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-floating"
          style={{ touchAction: 'pinch-zoom' }}
          draggable={false}
        />
        {title && (
          <p className="absolute bottom-0 left-0 right-0 text-center text-white text-xs font-medium bg-black/50 py-2 px-4 rounded-b-xl backdrop-blur-sm">
            {title}
          </p>
        )}
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs flex items-center gap-1">
        <ZoomIn size={12} /> Pinch to zoom · Tap outside to close
      </p>
    </div>
  );
}
