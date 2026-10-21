import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { sampleProducts } from '../data/sampleProducts';
import { sortCatalog } from '../utils/sortCatalog';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [allProducts, setAllProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('mbw_catalog_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategoryRaw] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [deepLinkProductId, setDeepLinkProductId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('item') || null;
  });

  const deepLinkHandled = useRef(false);

  // Sync activeCategory to URL
  const setActiveCategory = useCallback((cat) => {
    setActiveCategoryRaw(cat);
    const url = new URL(window.location.href);
    if (cat === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', cat);
    }
    window.history.pushState({}, '', url.toString());
  }, []);

  // Fetch products from GET /api/products; fall back to mock items ONLY if server is unreachable
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      // Fetch all products including drafts for admin; storefront displays filteredProducts
      const res = await fetch(`${base}/products?includeDrafts=true`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`Server responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      const products = Array.isArray(data) ? data : (data.products || []);
      setAllProducts(products);
      try {
        localStorage.setItem('mbw_catalog_cache', JSON.stringify(products));
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.warn('Backend server unreachable, falling back to mock catalog:', err.message);
      // Fall back to mock items ONLY if the backend server is unreachable
      setAllProducts((prev) => (prev && prev.length > 0 ? prev : sampleProducts));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle ?item= deep-link: scroll to and signal product card to open lightbox
  useEffect(() => {
    if (deepLinkProductId && !deepLinkHandled.current && allProducts.length > 0) {
      deepLinkHandled.current = true;
      setTimeout(() => {
        const el = document.getElementById(`product-${deepLinkProductId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click();
        }
      }, 500);
    }
  }, [deepLinkProductId, allProducts]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategoryRaw(params.get('category') || 'all');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Public storefront items: only 'live' and 'reserved' status displayed (drafts strictly hidden)
  const filteredProducts = sortCatalog(allProducts, sortBy, searchQuery, activeCategory);

  return (
    <CatalogContext.Provider
      value={{
        allProducts,
        filteredProducts,
        loading,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        deepLinkProductId,
        setDeepLinkProductId,
        refetch: fetchProducts,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
