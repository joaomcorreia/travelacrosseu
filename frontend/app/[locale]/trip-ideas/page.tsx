import { notFound } from "next/navigation";
import { fetchBlogPosts, type BlogPost } from "@/lib/api/blog";
import { fetchPage } from "@/lib/api/pages";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";
import { buildSectionUrl, getCanonicalPageSlug } from "@/lib/localized-slugs";
import { PageWithSidebar } from "@/components/layout/PageWithSidebar";
import { SidebarCard, SidebarLink, SidebarList } from "@/components/layout/SidebarComponents";
import SidebarPromoCard from "@/components/sidebar/SidebarPromoCard";
import TripStylesStrip from "@/components/trip-ideas/TripStylesStrip";
import TripIdeasContent from "./TripIdeasContent";

type TripIdeasPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: TripIdeasPageProps["params"];
}) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Fetch CMS data for this page
  const pageSlug = getCanonicalPageSlug('tripIdeas');
  const cmsData = await fetchPage(pageSlug, safeLocale);

  if (!cmsData) {
    // Fallback if CMS data not available
    return buildSeoMetadata({
      locale: safeLocale,
      slug: 'trip-ideas',
      cmsData: {
        title: "Trip Ideas",
        meta_title: "Trip Ideas – TravelAcross EU",
        meta_description: "Simple itineraries and calm, realistic suggestions for trips around Europe.",
        body: ""
      },
      contentType: 'static',
      pagePath: buildSectionUrl('tripIdeas', safeLocale)
    });
  }

  return buildSeoMetadata({
    locale: safeLocale,
    slug: pageSlug,
    cmsData: {
      title: cmsData.title || "Trip Ideas",
      meta_title: cmsData.meta_title || "Trip Ideas – TravelAcross EU",
      meta_description: cmsData.meta_description || "Simple itineraries and calm, realistic suggestions for trips around Europe.",
      body: cmsData.body || ""
    },
    contentType: 'page',
    pagePath: buildSectionUrl('tripIdeas', safeLocale)
  });
}



export default async function TripIdeasPage({
  params,
}: TripIdeasPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  // Fetch CMS data for this page
  const pageSlug = getCanonicalPageSlug('tripIdeas');
  const cmsData = await fetchPage(pageSlug, activeLocale);

  // Fetch blog posts filtered by trip-ideas category
  let allPosts: BlogPost[] = [];

  try {
    allPosts = await fetchBlogPosts("trip-ideas", activeLocale);
  } catch (error) {
    console.error(`Failed to fetch trip ideas for /${locale}/trip-ideas:`, error);
  }

  // Sidebar content
  const sidebar = (
    <>
      {/* Filter by duration */}
      <SidebarCard title="Filter by Duration">
        <SidebarList>
          <SidebarLink href={`/${activeLocale}/trip-ideas?duration=weekend`}>
            Weekend
          </SidebarLink>
          <SidebarLink href={`/${activeLocale}/trip-ideas?duration=3-5-days`}>
            3–5 days
          </SidebarLink>
          <SidebarLink href={`/${activeLocale}/trip-ideas?duration=7-plus-days`}>
            7+ days
          </SidebarLink>
        </SidebarList>
      </SidebarCard>

      {/* Top weekend ideas */}
      <SidebarCard title="Top Weekend Ideas">
        <SidebarList>
          <div className="space-y-3">
            <div>
              <SidebarLink href={`/${activeLocale}/cities/paris`}>48 Hours in Paris</SidebarLink>
              <p className="text-xs text-slate-500 mt-1">Classic city break</p>
            </div>
            <div>
              <SidebarLink href={`/${activeLocale}/cities/amsterdam`}>Amsterdam Weekend</SidebarLink>
              <p className="text-xs text-slate-500 mt-1">Canals and culture</p>
            </div>
            <div>
              <SidebarLink href={`/${activeLocale}/cities/rome`}>Rome in 2 Days</SidebarLink>
              <p className="text-xs text-slate-500 mt-1">Ancient meets modern</p>
            </div>
            <div>
              <SidebarLink href={`/${activeLocale}/cities/barcelona`}>Barcelona Getaway</SidebarLink>
              <p className="text-xs text-slate-500 mt-1">Art and architecture</p>
            </div>
          </div>
        </SidebarList>
      </SidebarCard>

      {/* Sponsored trips placeholder */}
      <SidebarPromoCard
        label="Sponsored (placeholder)"
        title="Curated rail & city break packages"
        description="Coming soon: hand-picked partner trips across Europe with exclusive deals."
        imageSrc="/images/sidebar/rail-packages.jpg"
        imageAlt="European rail travel packages"
        tone="yellow"
      />

      {/* Destinations Cross-Promo */}
      <SidebarPromoCard
        label="Explore more"
        title="Not sure where to go yet?"
        description="Browse our Destinations to explore landmarks, neighborhoods and viewpoints before picking a route."
        ctaLabel="View destinations"
        href={buildSectionUrl('destinations', activeLocale)}
        tone="blue"
      />

      {/* Best time to visit info */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-2">Best Time to Visit Europe</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>Spring (Mar-May):</strong> Mild weather, fewer crowds</p>
          <p><strong>Summer (Jun-Aug):</strong> Peak season, best weather</p>
          <p><strong>Fall (Sep-Nov):</strong> Great weather, harvest season</p>
          <p><strong>Winter (Dec-Feb):</strong> Christmas markets, skiing</p>
        </div>
      </div>
    </>
  );

  return (
    <PageWithSidebar
      title={cmsData?.title || "Trip Ideas"}
      subtitle={cmsData?.subtitle || "Weekend escapes, road trips, and longer itineraries across Europe."}
      sidebar={sidebar}
    >
      <TripStylesStrip />
      <TripIdeasContent initialPosts={allPosts} locale={activeLocale} />
    </PageWithSidebar>
  );
}