import { useCatalog } from '../../context/CatalogContext';
import ProductCard from './ProductCard';
import { ProductSkeletonGrid } from '../ui/ProductSkeleton';
import EmptyCatalogState from './EmptyCatalogState';

export default function CatalogGrid() {
  const { filteredProducts, loading, searchQuery, allProducts } = useCatalog();

  // Show skeletons only when there's no cache at all
  if (loading && allProducts.length === 0) {
    return (
      <div className="py-6">
        <ProductSkeletonGrid count={8} />
      </div>
    );
  }

  if (!loading && filteredProducts.length === 0 && searchQuery.trim()) {
    return <EmptyCatalogState />;
  }

  if (!loading && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <h3 className="font-display font-bold text-xl text-obsidian dark:text-canvas mb-2">
          Nothing here yet
        </h3>
        <p className="text-sm text-muted dark:text-darkMuted">
          Check back soon — new drops are on the way!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-1 pb-8 px-4 lg:px-0 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

