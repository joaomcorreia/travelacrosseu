import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPosts, type BlogPost } from "@/lib/api/blog";
import { fetchPage } from "@/lib/api/pages";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";
import { buildSectionUrl, getCanonicalPageSlug } from "@/lib/localized-slugs";
import { PageWithSidebar } from "@/components/layout/PageWithSidebar";
import { SidebarCard, SidebarLink, SidebarList, CtaCard } from "@/components/layout/SidebarComponents";
import SidebarPromoCard from "@/components/sidebar/SidebarPromoCard";
import TravelStoriesContent from "./TravelStoriesContent";

type TravelStoriesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: TravelStoriesPageProps["params"];
}) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Fetch CMS data for this page
  const pageSlug = getCanonicalPageSlug('travelStories');
  const cmsData = await fetchPage(pageSlug, safeLocale);

  if (!cmsData) {
    // Fallback if CMS data not available
    return buildSeoMetadata({
      locale: safeLocale,
      slug: 'travel-stories',
      cmsData: {
        title: "Travel Stories",
        meta_title: "Travel Stories – TravelAcross EU",
        meta_description: "Real trips, honest lessons and calm, practical advice for travelling across Europe.",
        body: ""
      },
      contentType: 'static',
      pagePath: buildSectionUrl('travelStories', safeLocale)
    });
  }

  return buildSeoMetadata({
    locale: safeLocale,
    slug: pageSlug,
    cmsData: {
      title: cmsData.title || "Travel Stories",
      meta_title: cmsData.meta_title || "Travel Stories – TravelAcross EU",
      meta_description: cmsData.meta_description || "Real trips, honest lessons and calm, practical advice for travelling across Europe.",
      body: cmsData.body || ""
    },
    contentType: 'page',
    pagePath: buildSectionUrl('travelStories', safeLocale)
  });
}



export default async function TravelStoriesPage({
  params,
}: TravelStoriesPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  // Fetch CMS data for this page
  const pageSlug = getCanonicalPageSlug('travelStories');
  const cmsData = await fetchPage(pageSlug, activeLocale);

  // Fetch blog posts filtered by travel-stories category
  let allPosts: BlogPost[] = [];

  try {
    allPosts = await fetchBlogPosts("travel-stories", activeLocale);
  } catch (error) {
    console.error(`Failed to fetch travel stories for /${locale}/travel-stories:`, error);
  }

  // Sidebar content
  const sidebar = (
    <>
      {/* Popular stories */}
      <SidebarCard title="Popular Stories">
        <SidebarList>
          {allPosts.slice(0, 4).map((post) => (
            <SidebarLink key={post.slug} href={`/${activeLocale}/blog/${post.slug}`}>
              {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
            </SidebarLink>
          ))}
        </SidebarList>
      </SidebarCard>

      {/* Stories by theme */}
      <SidebarCard title="Stories by Theme">
        <SidebarList>
          <SidebarLink href={`/${activeLocale}/travel-stories?theme=romantic`}>
            Romantic
          </SidebarLink>
          <SidebarLink href={`/${activeLocale}/travel-stories?theme=solo`}>
            Solo travel
          </SidebarLink>
          <SidebarLink href={`/${activeLocale}/travel-stories?theme=city-breaks`}>
            City breaks
          </SidebarLink>
          <SidebarLink href={`/${activeLocale}/travel-stories?theme=road-trips`}>
            Road trips
          </SidebarLink>
        </SidebarList>
      </SidebarCard>

      {/* Trip Ideas Cross-Promo */}
      <SidebarPromoCard
        label="Trip ideas"
        title="Turn stories into your own itinerary"
        description="Browse our Trip Ideas section for ready-made routes inspired by these stories."
        ctaLabel="View trip ideas"
        href={buildSectionUrl('tripIdeas', activeLocale)}
        imageSrc="/images/sidebar/map-notebook.jpg"
        imageAlt="Map and notebook planning"
        tone="neutral"
      />

      {/* CTA */}
      <CtaCard
        title="Plan your own story"
        description="Ready to create your own European adventure? Start exploring destinations and planning your perfect trip."
        buttonText="Explore destinations"
        buttonHref={buildSectionUrl('destinations', activeLocale)}
      />
    </>
  );

  return (
    <PageWithSidebar
      title={cmsData?.title || "Travel Stories"}
      subtitle={cmsData?.subtitle || "First-hand stories and experiences from trips across Europe."}
      sidebar={sidebar}
    >
      <TravelStoriesContent initialPosts={allPosts} locale={activeLocale} />
    </PageWithSidebar>
  );
}