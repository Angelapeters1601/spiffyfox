import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
    {/* Navbar Skeleton */}
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton circle width={60} height={60} />
          <Skeleton width={120} height={32} />
        </div>
        <div className="hidden space-x-6 md:flex">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width={60} height={24} />
          ))}
        </div>
        <Skeleton circle width={40} height={40} className="md:hidden" />
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="mx-auto max-w-6xl">
      {/* Hero Section Skeleton */}
      <div className="mb-12 text-center">
        <Skeleton width={300} height={48} className="mx-auto mb-4" />
        <Skeleton width={400} height={24} className="mx-auto mb-6" />
        <Skeleton width={200} height={50} className="mx-auto" />
      </div>

      {/* Features Grid Skeleton */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton circle width={80} height={80} className="mx-auto mb-4" />
            <Skeleton width={120} height={24} className="mx-auto mb-2" />
            <Skeleton count={3} className="mx-auto" />
          </div>
        ))}
      </div>

      {/* Content Sections Skeleton */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Skeleton width={200} height={32} className="mb-4" />
            <Skeleton count={4} />
          </div>
          <Skeleton height={300} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton height={250} />
          <div>
            <Skeleton width={180} height={28} className="mb-4" />
            <Skeleton count={3} />
            <Skeleton width={150} height={40} className="mt-4" />
          </div>
        </div>
      </div>
    </div>

    {/* Footer Skeleton */}
    <div className="mt-12 border-t pt-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton width={100} height={24} className="mb-4" />
            <Skeleton count={3} width={80} />
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-6 text-center">
        <Skeleton width={250} height={20} className="mx-auto" />
      </div>
    </div>
  </div>
);

export default LoadingFallback;
