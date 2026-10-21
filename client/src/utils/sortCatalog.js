const STATUS_PRIORITY = {
  live: 0,
  reserved: 1,
  sold_out: 2,
};

/**
 * Client-side 4-state sorting with smart auto-demotion.
 * Never exposes 'draft' items to public storefront.
 */
export function sortCatalog(products, sortBy = 'popular', searchQuery = '', activeCategory = 'all') {
  return products
    // 0. Only items with status: 'live' or status: 'reserved' are displayed on public storefront (drafts remain completely hidden)
    .filter((item) => {
      const status = item.status || (item.inStock ? 'live' : 'sold_out');
      return status === 'live' || status === 'reserved';
    })
    // 1. Filter by Active Category
    .filter((item) => {
      if (activeCategory === 'all') return true;
      return item.category?.toLowerCase() === activeCategory.toLowerCase();
    })
    // 2. Filter by Search Query
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    })
    // 3. Sort with 4-State Priority Demotion
    .sort((a, b) => {
      const statusA = STATUS_PRIORITY[a.status ?? (a.inStock ? 'live' : 'sold_out')] ?? 3;
      const statusB = STATUS_PRIORITY[b.status ?? (b.inStock ? 'live' : 'sold_out')] ?? 3;

      if (statusA !== statusB) return statusA - statusB;

      // Secondary Sort Criteria
      if (sortBy === 'price-low') {
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      }
      if (sortBy === 'price-high') {
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Default: 'popular'
      return (b.popularity || 0) - (a.popularity || 0);
    });
}
