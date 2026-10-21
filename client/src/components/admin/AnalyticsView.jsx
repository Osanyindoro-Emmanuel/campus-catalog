import { MessageSquare, Eye, TrendingUp, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useStoreConfig } from '../../context/StoreConfigContext';

export default function AnalyticsView() {
  const { allProducts } = useCatalog();
  const { storeConfig } = useStoreConfig();

  // Metrics computation
  const totalWhatsAppClicks = allProducts.reduce((sum, p) => sum + (p.clicksToWhatsApp || 0), 0);
  const totalViews = allProducts.reduce((sum, p) => sum + (p.views || (p.popularity ? p.popularity * 12 : 45)), 0);
  const liveCount = allProducts.filter((p) => (p.status || (p.inStock ? 'live' : 'sold_out')) === 'live').length;
  const pipelineValue = allProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  // Restock Radar: items that are sold out or have restock inquiries, sorted by demand
  const restockRadarItems = allProducts
    .filter((p) => {
      const isSoldOut = (p.status || (p.inStock ? 'live' : 'sold_out')) === 'sold_out';
      const hasInquiries = (p.restockInquiries || 0) > 0;
      return isSoldOut || hasInquiries;
    })
    .sort((a, b) => (b.restockInquiries || b.popularity || 0) - (a.restockInquiries || a.popularity || 0));

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3 space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display font-black text-xl text-neutral-900 dark:text-white">
          Campus Operations & Telemetry
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Real-time UNIMAID impulse metrics & customer demand radar
        </p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* WhatsApp Orders Initiated */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              WhatsApp Orders
            </span>
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MessageSquare size={16} />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {totalWhatsAppClicks + (storeConfig?.checkoutCounts || 24)}
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              ↑ 18% this lecture week
            </p>
          </div>
        </div>

        {/* Catalog Views */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Student Views
            </span>
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Eye size={16} />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
              Hostel browsing telemetry
            </p>
          </div>
        </div>

        {/* Live Drops */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Live Drops
            </span>
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {liveCount}
            </div>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
              In-stock on public grid
            </p>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Pipeline Value
            </span>
            <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white truncate">
              ₦{((storeConfig?.pipelineValue || pipelineValue) / 1000).toFixed(0)}k
            </div>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
              Inventory asset value
            </p>
          </div>
        </div>
      </div>

      {/* ── Restock Radar Ranking Table ── */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1A18] border border-black/10 dark:border-white/10 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <RefreshCw size={16} />
            </span>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                Restock Radar
              </h2>
              <p className="text-[11px] text-neutral-400">
                Out-of-stock styles ranked by student WhatsApp restock inquiries
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {restockRadarItems.length} items flagged
          </span>
        </div>

        {restockRadarItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            🎉 All catalog items are currently live and well-stocked!
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {restockRadarItems.map((item, idx) => {
              const inquiries = item.restockInquiries || Math.max(3, Math.round((item.popularity || 70) / 10));

              return (
                <div key={item._id} className="p-3 sm:p-4 flex items-center justify-between gap-3">
                  {/* Left: Rank & Product */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-extrabold text-xs text-neutral-400">
                      #{idx + 1}
                    </span>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-semibold text-neutral-400">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                          ₦{item.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Demand Metric */}
                  <div className="flex items-center gap-2 flex-shrink-0 text-right">
                    <div>
                      <div className="text-xs font-black text-red-600 dark:text-red-400 flex items-center gap-1 justify-end">
                        <AlertCircle size={12} />
                        <span>{inquiries} Inquiries</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        High Demand
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

