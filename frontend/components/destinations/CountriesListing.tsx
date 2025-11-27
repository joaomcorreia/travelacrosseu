"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DestinationCard, { DestinationCardGrid, DestinationCardSkeleton } from "@/components/destinations/DestinationCard";
import { fetchCountries, type Country } from "@/lib/api/destinations";
import { type Locale } from "@/lib/locales";

// Countries Listing Component
export default function CountriesListing({ locale }: { locale: Locale }) {
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
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              European Countries
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover amazing destinations across Europe
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <DestinationCardGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </DestinationCardGrid>
          )}

          {/* Countries Grid */}
          {!loading && !error && (
            <DestinationCardGrid>
              {filteredCountries.map((country) => (
                <DestinationCard
                  key={country.id}
                  title={country.name}
                  description={`Explore ${country.name} and discover its unique culture, history, and attractions.`}
                  href={`/${locale}/destinations/${country.slug}`}
                  imageUrl={country.image_url || undefined}
                />
              ))}
            </DestinationCardGrid>
          )}

          {/* No Results */}
          {!loading && !error && filteredCountries.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-600">No countries found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}