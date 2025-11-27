import { notFound } from "next/navigation";
import { fetchBlogPosts, type BlogPost } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";
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

  const cmsData = {
    title: "Trip Ideas",
    meta_title: "Trip Ideas – TravelAcross EU",
    meta_description: "Simple itineraries and calm, realistic suggestions for trips around Europe. Discover carefully curated trip ideas for every type of traveler.",
    body: "Explore our collection of simple itineraries and realistic suggestions for European adventures."
  };

  return buildSeoMetadata({
    locale: safeLocale,
    slug: 'trip-ideas',
    cmsData,
    contentType: 'static',
    pagePath: `/${safeLocale}/trip-ideas`
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

  // Fetch blog posts filtered by trip-ideas category
  let allPosts: BlogPost[] = [];

  try {
    allPosts = await fetchBlogPosts("trip-ideas", activeLocale);
  } catch (error) {
    console.error(`Failed to fetch trip ideas for /${locale}/trip-ideas:`, error);
  }

  return <TripIdeasContent initialPosts={allPosts} locale={activeLocale} />;
}