"use client";

import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/lib/api/destinations";
import type { Locale } from "@/lib/locales";

interface DestinationCardProps {
  destination: Destination;
  locale: Locale;
}

function DestinationCard({ destination, locale }: DestinationCardProps) {
  const FALLBACK_DEST_IMAGE = "/images/destinations/default.jpg";
  
  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-slate-900/80 border border-slate-800">
      <div className="relative aspect-[4/3]">
        <Link
          href={`/${locale}/destinations/${destination.city.country.slug}/${destination.city.slug}/${destination.slug}`}
          className="group block w-full h-full hover:-translate-y-1 transition-all duration-300"
        >
          <Image
            src={destination.hero_image || 
              (destination.hero_slides && destination.hero_slides.length > 0 ? destination.hero_slides[0]?.image : null) ||
              FALLBACK_DEST_IMAGE}
            alt={destination.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-xs text-white/70 uppercase tracking-wide">
              {destination.city.country.name}
            </p>
            <h3 className="text-lg font-semibold text-white leading-tight">
              {destination.title}
            </h3>
          </div>
        </Link>
      </div>
    </article>
  );
}

interface FeaturedDestinationsProps {
  destinations: Destination[];
  locale: Locale;
  className?: string;
}

export default function FeaturedDestinations({ destinations, locale, className = "" }: FeaturedDestinationsProps) {
  // Show message if no destinations
  if (!destinations || destinations.length === 0) {
    return (
      <section className={`py-16 bg-white ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Featured Destinations
            </h2>
            <p className="text-gray-600">
              Featured destinations will appear here once they are added to the CMS.
            </p>
            <Link
              href={`/${locale}/destinations`}
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse All Destinations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Get the first 6 destinations for featured section
  const featured = destinations.slice(0, 6);
  if (!featured.length) return null;

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600">
            Discover our handpicked selection of must-visit European destinations
          </p>
        </div>

        {/* Featured Destinations Grid Layout */}
        <div className="mt-8">
          {/* Desktop: 2x3 Grid */}
          <div className="hidden md:grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                locale={locale}
              />
            ))}
          </div>

          {/* Mobile / Small Tablet */}
          <div className="grid gap-4 md:hidden">
            {featured.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                locale={locale}
              />
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/destinations`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
          >
            Explore All Destinations
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}