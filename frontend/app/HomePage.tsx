"use client";

import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/cms/HeroSlider";
import SectionRenderer from "@/components/cms/SectionRenderer";
import EnhancedHeroSection from "@/components/home/EnhancedHeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import TripStylesSection from "@/components/home/TripStylesSection";
import QuickIdeasStrip from "@/components/home/QuickIdeasStrip";
import FlightsCtaSection from "@/components/home/FlightsCtaSection";
import LatestBlogPosts from "@/components/home/LatestBlogPosts";
import WhyTravelAcrossSection from "@/components/home/WhyTravelAcrossSection";
import AdSlot from "@/components/common/AdSlot";
import { fetchDestinations } from "@/lib/api/destinations";
import type { TravelPage } from "@/lib/api";
import type { CmsPagePayload } from "@/lib/api/pages";
import type { Destination } from "@/lib/api/destinations";
import type { HomepageCategory } from "@/lib/api/homepage";
import type { Locale } from "@/lib/locales";
import type { CommonDictionary } from "@/lib/i18n/getDictionary";

type HomePageProps = {
  locale: Locale;
  destinations: TravelPage[];
  messages: CommonDictionary["home"];
  cmsHomepage?: CmsPagePayload | null;
  categories?: HomepageCategory[];
};

const FALLBACK_DESTINATIONS: TravelPage[] = [
  {
    id: 0,
    language: "en",
    slug: "lisbon-demo",
    title: "Lisbon City Break",
    summary: "Sunlit viewpoints, vintage trams, and azulejo-studded cafés.",
    is_published: true,
    country: { id: 0, code: "PT", name: "Portugal", slug: "portugal" },
    city: { id: 0, name: "Lisbon", slug: "lisbon" },
    category: null,
  },
  {
    id: 1,
    language: "en",
    slug: "paris-demo",
    title: "Paris Getaway",
    summary: "Sunrise boulangeries, museum nights, and Seine strolls.",
    is_published: true,
    country: { id: 0, code: "FR", name: "France", slug: "france" },
    city: { id: 0, name: "Paris", slug: "paris" },
    category: null,
  },
  {
    id: 2,
    language: "en",
    slug: "amsterdam-demo",
    title: "Amsterdam Weekend",
    summary: "Canal-hopping, indie galleries, and cozy brown cafés.",
    is_published: true,
    country: { id: 0, code: "NL", name: "Netherlands", slug: "netherlands" },
    city: { id: 0, name: "Amsterdam", slug: "amsterdam" },
    category: null,
  },
];


export default function HomePage({ locale, destinations, messages, cmsHomepage, categories = [] }: HomePageProps) {
  const preferredLocale = locale ?? "en";
  const hasRealDestinations = destinations?.length > 0;
  const items = (hasRealDestinations ? destinations : FALLBACK_DESTINATIONS).slice(
    0,
    3
  );
  const { badge, hero, seasonal, featured, themes, blog, howItWorks } = messages;
  const cmsTitle = cmsHomepage?.title?.trim();
  const cmsSubtitle = cmsHomepage?.subtitle?.trim();
  const cmsBody = cmsHomepage?.body?.trim();
  const hasHeroMedia = cmsHomepage?.hero_slides?.length > 0 || cmsHomepage?.hero_image;

  return (
    <div>
      {/* 1. Enhanced Hero Section */}
      <EnhancedHeroSection locale={preferredLocale} cmsData={cmsHomepage} />

      {/* 2. Categories Section - Explore by Category masonry */}
      <CategoriesSection locale={preferredLocale} categories={categories} />

      {/* 3. Featured Destinations */}
      <FeaturedDestinations destinations={destinations} locale={preferredLocale} />

      {/* 4. Trip Styles Section */}
      <TripStylesSection locale={preferredLocale} />

      {/* Ad Slot 1 */}
      <div className="py-6">
        <AdSlot position="home_mid_1" />
      </div>

      {/* 5. Quick Ideas Strip */}
      <QuickIdeasStrip locale={preferredLocale} />

      {/* 6. Latest Blog Posts / Travel Stories */}
      <LatestBlogPosts locale={preferredLocale} />

      {/* 7. Why TravelAcross EU Section */}
      <WhyTravelAcrossSection locale={preferredLocale} />

      {/* Ad Slot 2 */}
      <div className="py-6">
        <AdSlot position="home_mid_2" />
      </div>

      {/* 8. Flights CTA Section */}
      <FlightsCtaSection locale={preferredLocale} variant="compact" />

      {/* 9. Ready for your next getaway? footer promo */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for your next getaway?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start planning your perfect European trip with our AI-powered guides and local insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${preferredLocale}/destinations`}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold"
            >
              Browse Destinations
            </Link>
            <Link
              href={`/${preferredLocale}/countries`}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 font-semibold"
            >
              Explore Countries
            </Link>
          </div>
        </div>
      </section>

      {/* CMS Sections */}
      {cmsHomepage?.sections && cmsHomepage.sections.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
          <SectionRenderer sections={cmsHomepage.sections} />
        </section>
      )}
    </div>
  );
}
