import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { fetchCities, type City } from "@/lib/api/destinations";
import { fetchPage } from "@/lib/api/pages";
import type { Locale } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { buildSectionUrl, getCanonicalPageSlug } from "@/lib/localized-slugs";
import { PageWithSidebar } from "@/components/layout/PageWithSidebar";
import { SidebarCard, SidebarLink, SidebarList } from "@/components/layout/SidebarComponents";
import SidebarPromoCard from "@/components/sidebar/SidebarPromoCard";
import { resolveCityImage } from "@/lib/config/city-images";

interface CityCardProps {
  city: City;
  locale: Locale;
  messages: any;
}

function CityCard({ city, locale, messages }: CityCardProps) {
  const imageSrc = resolveCityImage(city.slug, city.name, city.country.slug, city.hero_image);

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={imageSrc}
          alt={city.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-semibold text-white">
            {city.name}
          </h3>
          <p className="text-sm text-white/80">
            {city.country.name}
          </p>
        </div>
      </div>

      <div className="p-4">
        {city.short_description && (
          <div 
            className="text-sm text-slate-600 mb-3 line-clamp-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: city.short_description }}
          />
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            {city.destinations_count && city.destinations_count > 0 ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                {messages.destinationsCount.replace('{count}', city.destinations_count)}
              </span>
            ) : (
              <span className="text-xs text-slate-400">{messages.noDestinations}</span>
            )}
          </div>
          <Link
            href={`${buildSectionUrl('cities', locale)}/${city.slug}`}
            className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            {messages.exploreCityButton}
          </Link>
        </div>
      </div>
    </article>
  );
}

interface CitiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CitiesPage({ params }: CitiesPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  // Fetch CMS data for this page
  const pageSlug = getCanonicalPageSlug('cities');
  
  const [cities, dictionary, cmsData] = await Promise.all([
    fetchCities(undefined, locale),
    getDictionary(locale),
    fetchPage(pageSlug, locale)
  ]);

  // Sidebar content
  const sidebar = (
    <>
      {/* City of the month */}
      <SidebarPromoCard
        label={dictionary.cities.cityOfMonth}
        title="Prague, Czechia"
        description="Fairytale old town, river views and great value for a city break."
        ctaLabel="Explore Prague"
        href="#"
        imageSrc="/images/sidebar/prague-city-of-month.jpg"
        imageAlt="Prague old town and castle"
        tone="blue"
      />

      {/* Capital cities */}
      <SidebarCard title={dictionary.cities.capitalCities}>
        <SidebarList>
          <SidebarLink href={`${buildSectionUrl('cities', locale)}/amsterdam`}>Amsterdam</SidebarLink>
          <SidebarLink href={`${buildSectionUrl('cities', locale)}/paris`}>Paris</SidebarLink>
          <SidebarLink href={`${buildSectionUrl('cities', locale)}/berlin`}>Berlin</SidebarLink>
          <SidebarLink href={`${buildSectionUrl('cities', locale)}/rome`}>Rome</SidebarLink>
          <SidebarLink href={`${buildSectionUrl('cities', locale)}/madrid`}>Madrid</SidebarLink>
        </SidebarList>
      </SidebarCard>

      {/* Popular city breaks */}
      <SidebarCard title={dictionary.cities.popularCityBreaks}>
        <SidebarList>
          <SidebarLink href={`/${locale}/cities/paris`}>Paris</SidebarLink>
          <SidebarLink href={`/${locale}/cities/amsterdam`}>Amsterdam</SidebarLink>
          <SidebarLink href={`/${locale}/cities/barcelona`}>Barcelona</SidebarLink>
          <SidebarLink href={`/${locale}/cities/rome`}>Rome</SidebarLink>
          <SidebarLink href={`/${locale}/cities/prague`}>Prague</SidebarLink>
          <SidebarLink href={`/${locale}/cities/lisbon`}>Lisbon</SidebarLink>
        </SidebarList>
      </SidebarCard>

      {/* Browse cities by country */}
      <SidebarCard title={dictionary.cities.browseByCountry}>
        <SidebarList>
          <SidebarLink href={`/${locale}/countries/france`}>France</SidebarLink>
          <SidebarLink href={`/${locale}/countries/spain`}>Spain</SidebarLink>
          <SidebarLink href={`/${locale}/countries/italy`}>Italy</SidebarLink>
          <SidebarLink href={`/${locale}/countries/germany`}>Germany</SidebarLink>
          <SidebarLink href={`/${locale}/countries/netherlands`}>Netherlands</SidebarLink>
          <SidebarLink href={`/${locale}/countries/portugal`}>Portugal</SidebarLink>
        </SidebarList>
      </SidebarCard>
    </>
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href={`/${locale}`} 
              className="text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              {dictionary.cities.breadcrumb.home}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{dictionary.cities.breadcrumb.cities}</span>
          </nav>
        </div>
      </div>

      <PageWithSidebar
        title={cmsData?.title || dictionary.cities.title}
        subtitle={cmsData?.subtitle || dictionary.cities.subtitle}
        sidebar={sidebar}
      >
        {/* Cities Grid */}
        {cities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">{dictionary.cities.noCitiesAvailable}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} locale={locale} messages={dictionary.cities} />
            ))}
          </div>
        )}
      </PageWithSidebar>
    </>
  );
}