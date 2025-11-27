"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DestinationCard, { DestinationCardGrid, DestinationCardSkeleton } from "@/components/destinations/DestinationCard";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchCountries, type Country } from "@/lib/api/destinations";
import { fetchPage, type CmsPagePayload } from "@/lib/api/pages";
import { isSupportedLocale, type Locale } from "@/lib/locales";

// Countries Listing Component
function CountriesListing({ locale }: { locale: Locale }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch countries data
  useEffect(() => {
    async function loadCountries() {
      try {
        setLoading(true);
        const countriesData = await fetchCountries();
        setCountries(countriesData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore European Countries
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the diverse cultures, rich histories, and stunning landscapes 
            of Europe through our carefully curated collection of destinations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-12">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Countries Grid */}
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
        ) : filteredCountries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? `No countries found matching "${searchTerm}"` : "No countries available"}
            </p>
          </div>
        ) : (
          <DestinationCardGrid>
            {filteredCountries.map((country) => (
              <DestinationCard
                key={country.id}
                title={country.name}
                subtitle={country.short_description || "Explore this amazing country"}
                imageUrl={country.image_url}
                href={`/${locale}/destinations/${country.slug}`}
                count={country.cities_count}
                countLabel={country.cities_count === 1 ? "city" : "cities"}
              />
            ))}
          </DestinationCardGrid>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  // Generate params for all supported locales
  const supportedLocales = ['en', 'fr', 'es', 'it', 'de', 'pt', 'nl'];
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function DestinationsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  if (!isSupportedLocale(locale)) {
    return notFound();
  }

  // Fetch CMS page data for hero section
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage('destinations', locale);
  } catch (error) {
    console.error("Error fetching CMS page:", error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {cmsPage?.sections?.[0]?.background_image_url && (
            <Image
              src={cmsPage.sections[0].background_image_url}
              alt=""
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {cmsPage?.title || "European Destinations"}
          </h1>
          {cmsPage?.subtitle && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {cmsPage.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Countries Listing */}
      <CountriesListing locale={locale} />

      {/* CMS Content Sections */}
      {cmsPage?.sections && cmsPage.sections.length > 0 && (
        <div className="space-y-16">
          {cmsPage.sections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}