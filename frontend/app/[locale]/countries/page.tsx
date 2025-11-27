"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locales";

interface Country {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  hero_image: string | null;
  destinations_count: number;
  stories_count: number;
  has_content: boolean;
}

interface CountryCardProps {
  country: Country;
  locale: Locale;
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function CountryCard({ country, locale }: CountryCardProps) {
  // Extract filename from Django URL or use the slug-based filename
  let imageSrc = "/images/countries/default-country.jpg";
  
  if (country.hero_image) {
    if (country.hero_image.includes('country-')) {
      // Extract filename from Django media URL
      const filename = country.hero_image.split('/').pop();
      imageSrc = `/images/countries/${filename}`;
    } else {
      // Fallback: construct filename from slug
      imageSrc = `/images/countries/country-${country.slug}.jpg`;
    }
  }

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-40">
        <Image
          src={imageSrc}
          alt={country.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-semibold text-white">
            {country.name}
          </h3>
          {country.short_description && (
            <p className="mt-1 text-xs text-white/80 line-clamp-2">
              {country.short_description}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          {country.destinations_count > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
              {country.destinations_count} destinations
            </span>
          )}
          {country.stories_count > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
              {country.stories_count} stories
            </span>
          )}
        </div>
        <Link
          href={`/${locale}/countries/${country.slug}`}
          className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          View trips
        </Link>
      </div>
    </article>
  );
}

interface CountriesPageProps {
  params: Promise<{ locale: string }>;
}

export default function CountriesPage({ params }: CountriesPageProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyWithRoutes, setOnlyWithRoutes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [resolvedParams, setResolvedParams] = useState<{ locale: string } | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const p = await params;
      setResolvedParams(p);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/api/cms/countries/`);
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  if (!resolvedParams) return <div>Loading...</div>;

  const locale = resolvedParams.locale as Locale;

  // Filter countries
  const allCountries = countries;
  const countriesWithContent = countries.filter((c) => c.has_content);
  
  let visibleCountries = onlyWithRoutes ? countriesWithContent : allCountries;
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    visibleCountries = visibleCountries.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.short_description.toLowerCase().includes(query)
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading countries...</p>
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
              European Countries
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover amazing destinations and travel experiences across Europe. 
              Each country offers unique cultures, stunning landscapes, and unforgettable adventures.
            </p>
            
            {/* Search Input */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            
            {/* Filter Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {/* Style filters (placeholder) */}
              <button className="px-3 py-1 rounded-full text-xs border border-slate-300 bg-white text-slate-700">
                All styles
              </button>

              {/* Right-aligned toggle */}
              <button
                type="button"
                onClick={() => setOnlyWithRoutes((v) => !v)}
                className={cn(
                  "ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border",
                  onlyWithRoutes
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Only countries with routes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {visibleCountries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                {searchQuery 
                  ? `No countries found matching "${searchQuery}"`
                  : onlyWithRoutes 
                    ? "No countries with content available yet."
                    : "No countries available."
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleCountries.map((country) => (
                <CountryCard key={country.slug} country={country} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}