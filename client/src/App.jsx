import { useState, useEffect, lazy, Suspense } from 'react';
import CampusBroadcastBar from './components/layout/CampusBroadcastBar';
import HeaderNav from './components/layout/HeaderNav';
import StickyFilterBar from './components/catalog/StickyFilterBar';
import DynamicSpotlightHero from './components/hero/DynamicSpotlightHero';
import CatalogGrid from './components/catalog/CatalogGrid';
import ShoppingBagDrawer from './components/drawers/ShoppingBagDrawer';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import PrivateRoute from './components/admin/PrivateRoute';

// Code-split Admin bundle: completely isolated from public storefront initial load
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin');

  // ─── ADMIN PORTAL ROUTE (Code-Split & Protected) ───────────────────────────
  if (isAdminRoute) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#121110]">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      </Suspense>
    );
  }

  // ─── PUBLIC STOREFRONT ROUTE ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-neutral-900 dark:bg-[#121110] dark:text-neutral-100 transition-colors duration-200">
      {/* Announcement bar */}
      <CampusBroadcastBar />

      {/* Primary nav */}
      <HeaderNav />

      {/* Filter bar sits above hero — matching mockup layout */}
      <StickyFilterBar />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero banner */}
        <DynamicSpotlightHero />

        {/* Product grid */}
        <div id="product-catalog">
          <CatalogGrid />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Shopping bag slide-out drawer */}
      <ShoppingBagDrawer />

      {/* Global toast notifications */}
      <Toast />
    </div>
  );
}
