"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locales";

interface Country {
  name: string;
  slug: string;
}

interface City {
  name: string;
  slug: string;
}

interface Destination {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  hero_image: string | null;
  country: Country;
  city: City | null;
}

interface DestinationCardProps {
  destination: Destination;
  locale: Locale;
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function DestinationCard({ destination, locale }: DestinationCardProps) {
  const imageSrc = destination.hero_image || "/images/destinations/default-destination.jpg";

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-44">
        <Image
          src={imageSrc}
          alt={destination.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs text-white/80">
            {destination.city?.name
              ? `${destination.city.name}, ${destination.country.name}`
              : destination.country.name}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {destination.title}
          </h3>
          {destination.category && (
            <span className="mt-2 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white/90">
              {destination.category}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {destination.short_description && (
          <p className="text-xs text-slate-600 line-clamp-3">
            {destination.short_description}
          </p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/${locale}/destinations/${destination.slug}`}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

// Helper functions
function getUniqueCountriesFromDestinations(destinations: Destination[]) {
  const countriesMap = new Map();
  destinations.forEach(dest => {
    if (dest.country && !countriesMap.has(dest.country.slug)) {
      countriesMap.set(dest.country.slug, dest.country);
    }
  });
  return Array.from(countriesMap.values());
}

function getCitiesForCountry(destinations: Destination[], countrySlug: string | null) {
  if (!countrySlug) return [];
  const citiesMap = new Map();
  destinations
    .filter(dest => dest.country.slug === countrySlug && dest.city)
    .forEach(dest => {
      if (dest.city && !citiesMap.has(dest.city.slug)) {
        citiesMap.set(dest.city.slug, dest.city);
      }
    });
  return Array.from(citiesMap.values());
}

function getUniqueCategoriesFromDestinations(destinations: Destination[]) {
  const categories = new Set<string>();
  destinations.forEach(dest => {
    if (dest.category) {
      categories.add(dest.category);
    }
  });
  return Array.from(categories);
}

interface DestinationsPageProps {
  params: Promise<{ locale: string }>;
}

export default function DestinationsPage({ params }: DestinationsPageProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [resolvedParams, setResolvedParams] = useState<{ locale: string } | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const p = await params;
      setResolvedParams(p);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/api/cms/destinations/?locale=${resolvedParams?.locale || 'en'}`);
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    }

    if (resolvedParams) {
      fetchDestinations();
    }
  }, [resolvedParams]);

  // Reset city when country changes
  useEffect(() => {
    setSelectedCitySlug(null);
  }, [selectedCountrySlug]);

  if (!resolvedParams) return <div>Loading...</div>;

  const locale = resolvedParams.locale as Locale;

  // Derive filter options
  const countries = getUniqueCountriesFromDestinations(destinations);
  const cities = getCitiesForCountry(destinations, selectedCountrySlug);
  const categories = getUniqueCategoriesFromDestinations(destinations);

  // Apply filters
  const filteredDestinations = destinations.filter((dest) => {
    if (selectedCountrySlug && dest.country.slug !== selectedCountrySlug) return false;
    if (selectedCitySlug && dest.city?.slug !== selectedCitySlug) return false;
    if (selectedCategory && dest.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const haystack = `${dest.title} ${dest.short_description} ${dest.city?.name ?? ""} ${dest.country.name}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Places to Visit
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover amazing destinations, neighborhoods, and places worth your time across Europe. 
              From world-class museums to hidden local gems.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Search and Dropdowns */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, neighborhoods or landmarks..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Country select */}
            <select
              value={selectedCountrySlug ?? ""}
              onChange={(e) => setSelectedCountrySlug(e.target.value || null)}
              className="w-full md:w-48 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* City select */}
            <select
              value={selectedCitySlug ?? ""}
              onChange={(e) => setSelectedCitySlug(e.target.value || null)}
              className="w-full md:w-48 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              disabled={!selectedCountrySlug}
            >
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border",
                !selectedCategory
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 bg-white text-slate-600"
              )}
            >
              All types
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs border",
                  selectedCategory === category
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                {searchQuery || selectedCountrySlug || selectedCitySlug || selectedCategory
                  ? "No destinations found matching your filters."
                  : "No destinations available yet."
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-600">
                  {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} found
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.slug}
                    destination={destination}
                    locale={locale}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
