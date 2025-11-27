"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import DestinationCard, { DestinationCardGrid, DestinationCardSkeleton } from "@/components/destinations/DestinationCard";
import { fetchCountryBySlug, fetchCitiesByCountry, type Country, type City } from "@/lib/api/destinations";
import { isSupportedLocale, type Locale } from "@/lib/locales";

// Cities Listing Component
function CitiesListing({ country, locale }: { country: Country; locale: Locale }) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch cities data for this country
  useEffect(() => {
    async function loadCities() {
      try {
        setLoading(true);
        const citiesData = await fetchCitiesByCountry(country.slug);
        setCities(citiesData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities");
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, [country.slug]);

  // Filter cities based on search term
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cities in {country.name}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {country.short_description || `Explore the beautiful cities and destinations throughout ${country.name}.`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-12">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Cities Grid */}
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
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? `No cities found matching "${searchTerm}"` : "No cities available"}
            </p>
          </div>
        ) : (
          <DestinationCardGrid>
            {filteredCities.map((city) => (
              <DestinationCard
                key={city.id}
                title={city.name}
                subtitle={city.short_description || "Discover this amazing city"}
                image={city.hero_image}
                href={`/${locale}/destinations/${country.slug}/${city.slug}`}
                locale={locale}
                count={city.destinations_count}
              />
            ))}
          </DestinationCardGrid>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ locale: string; country: string }>;
}

export default async function CountryCitiesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const countrySlug = resolvedParams.country;

  if (!isSupportedLocale(locale)) {
    return notFound();
  }

  // Fetch country data
  let country: Country | null = null;
  try {
    country = await fetchCountryBySlug(countrySlug);
  } catch (error) {
    console.error("Error fetching country:", error);
    return notFound();
  }

  if (!country) {
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
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              All Countries
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{country.name}</span>
          </nav>
        </div>
      </div>

      {/* Country Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {country.hero_image && (
            <Image
              src={country.hero_image}
              alt={country.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {country.name}
          </h1>
          {country.short_description && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {country.short_description}
            </p>
          )}
        </div>
      </section>

      {/* Cities Listing */}
      <CitiesListing country={country} locale={locale} />
    </div>
  );
}