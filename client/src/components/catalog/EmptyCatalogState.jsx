import { MessageCircle } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export default function EmptyCatalogState() {
  const { searchQuery, setSearchQuery } = useCatalog();
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '2348000000000';

  const handleSourceIt = () => {
    const msg = `Hi Mide! I searched your website for '${searchQuery}' but didn't see it. Can you help me source or pre-order this?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="font-display font-bold text-xl text-obsidian dark:text-canvas mb-2">
        Nothing found
      </h3>
      <p className="text-sm text-muted dark:text-darkMuted mb-6 max-w-xs">
        We couldn&apos;t find <strong>&quot;{searchQuery}&quot;</strong> in today&apos;s catalog
      </p>
      <button
        onClick={handleSourceIt}
        className="flex items-center gap-2 bg-accent-emerald hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition active:scale-95"
      >
        <MessageCircle size={18} />
        💬 Ask Mide to Source It For You
      </button>
      <button
        onClick={() => setSearchQuery('')}
        className="mt-4 text-sm text-muted dark:text-darkMuted hover:text-obsidian dark:hover:text-white transition"
      >
        Clear search
      </button>
    </div>
  );
}
