export default function ProductSkeleton() {
  return (
    <div className="bg-surface dark:bg-darkSurface rounded-2xl p-3 border border-hairline dark:border-darkHairline shadow-studio flex flex-col gap-3 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[3/4] w-full rounded-xl bg-hairline dark:bg-darkHairline" />

      {/* Title placeholder */}
      <div className="space-y-2 px-1">
        <div className="h-4 bg-hairline dark:bg-darkHairline rounded-full w-3/4" />
        <div className="h-3 bg-hairline dark:bg-darkHairline rounded-full w-1/2" />
      </div>

      {/* Price placeholder */}
      <div className="h-5 bg-hairline dark:bg-darkHairline rounded-full w-1/3 px-1" />

      {/* Button placeholder */}
      <div className="h-10 bg-hairline dark:bg-darkHairline rounded-xl" />
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 max-w-7xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
