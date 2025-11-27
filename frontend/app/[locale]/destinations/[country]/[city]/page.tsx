"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  FunnelIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import DestinationCard, { DestinationCardGrid, DestinationCardSkeleton } from "@/components/destinations/DestinationCard";
import { 
  fetchCityBySlug, 
  fetchDestinationsByCity, 
  type City, 
  type Destination 
} from "@/lib/api/destinations";
import { isSupportedLocale, type Locale } from "@/lib/locales";

// Destinations Listing Component
function DestinationsListing({ city, locale }: { city: City; locale: Locale }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Fetch destinations data for this city
  useEffect(() => {
    async function loadDestinations() {
      try {
        setLoading(true);
        const destinationsData = await fetchDestinationsByCity(city.country.slug, city.slug);
        setDestinations(destinationsData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations");
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, [city.country.slug, city.slug]);

  // Get all unique tags for filtering
  const allTags = Array.from(
    new Set(
      destinations
        .flatMap(dest => dest.tags || [])
        .filter(Boolean)
    )
  ).sort();

  // Filter destinations based on search term, featured status, and tags
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = 
      destination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFeatured = !featuredOnly || destination.is_featured;
    
    const matchesTag = !selectedTag || destination.tags?.includes(selectedTag);
    
    return matchesSearch && matchesFeatured && matchesTag;
  });

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Destinations in {city.name}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {city.short_description || `Discover amazing attractions and experiences in ${city.name}.`}
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Featured Toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                featuredOnly
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {featuredOnly ? <StarIconSolid className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
              Featured Only
            </button>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(featuredOnly || selectedTag) && (
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2">
                {featuredOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <StarIconSolid className="h-3 w-3" />
                    Featured
                    <button
                      onClick={() => setFeaturedOnly(false)}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {selectedTag}
                    <button
                      onClick={() => setSelectedTag("")}
                      className="ml-1 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <DestinationCardGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <DestinationCardSkeleton key={index} />
            ))}
          </DestinationCardGrid>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm || featuredOnly || selectedTag 
                ? "No destinations match your current filters" 
                : "No destinations available"}
            </p>
            {(featuredOnly || selectedTag) && (
              <button
                onClick={() => {
                  setFeaturedOnly(false);
                  setSelectedTag("");
                  setSearchTerm("");
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <DestinationCardGrid>
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                title={destination.title}
                subtitle={destination.summary || "Explore this amazing destination"}
                image={destination.featured_image}
                href={`/${locale}/destinations/${city.country.slug}/${city.slug}/${destination.slug}`}
                locale={locale}
                badge={destination.is_featured ? "Featured" : undefined}
              />
            ))}
          </DestinationCardGrid>
        )}

        {/* Results Summary */}
        {!loading && !error && (
          <div className="text-center mt-8 text-gray-600">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </div>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ locale: string; country: string; city: string }>;
}

export default async function CityDestinationsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const countrySlug = resolvedParams.country;
  const citySlug = resolvedParams.city;

  if (!isSupportedLocale(locale)) {
    return notFound();
  }

  // Fetch city data (includes country data)
  let city: City | null = null;
  try {
    city = await fetchCityBySlug(countrySlug, citySlug);
  } catch (error) {
    console.error("Error fetching city:", error);
    return notFound();
  }

  if (!city) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href={`/${locale}/destinations`} 
              className="text-blue-600 hover:text-blue-800"
            >
              All Countries
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/${locale}/destinations/${city.country.slug}`} 
              className="text-blue-600 hover:text-blue-800"
            >
              {city.country.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* City Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {city.hero_image && (
            <Image
              src={city.hero_image}
              alt={city.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {city.name}
          </h1>
          <p className="text-lg opacity-90 mb-2">
            {city.country.name}
          </p>
          {city.short_description && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {city.short_description}
            </p>
          )}
        </div>
      </section>

      {/* Destinations Listing */}
      <DestinationsListing city={city} locale={locale} />
    </div>
  );
}