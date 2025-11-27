import Link from "next/link";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/outline";
import type { Locale } from "@/lib/locales";

interface DestinationCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href: string;
  locale: Locale;
  badge?: string;
  count?: number;
  className?: string;
}

export default function DestinationCard({
  title,
  subtitle,
  description,
  image,
  href,
  locale,
  badge,
  count,
  className = ""
}: DestinationCardProps) {
  // Generate fallback image URL if no image provided
  const fallbackImage = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=center";
  const imageUrl = image || fallbackImage;

  return (
    <Link 
      href={`/${locale}${href}`}
      className={`group relative block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 ${className}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badge overlay */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Count overlay */}
        {count !== undefined && count > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white shadow-sm">
              {count} {count === 1 ? 'place' : 'places'}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Subtitle/Location */}
        {subtitle && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MapPinIcon className="h-3 w-3 mr-1" />
            <span>{subtitle}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Action indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Explore →
          </span>
          
          {/* Optional rating or featured indicator can go here */}
          <div className="flex items-center space-x-1">
            {/* Placeholder for future enhancements like ratings */}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Utility component for card grids
export function DestinationCardGrid({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}

// Loading skeleton component
export function DestinationCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden animate-pulse ${className}`}>
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}