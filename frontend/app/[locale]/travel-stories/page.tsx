import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPosts, type BlogPost } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";
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

  const cmsData = {
    title: "Travel Stories",
    meta_title: "Travel Stories – TravelAcross EU",
    meta_description: "Real trips, honest lessons and calm, practical advice for travelling across Europe. Discover authentic travel stories from fellow European adventurers.",
    body: "Explore our collection of real travel experiences, honest lessons learned, and practical advice for European adventures."
  };

  return buildSeoMetadata({
    locale: safeLocale,
    slug: 'travel-stories',
    cmsData,
    contentType: 'static',
    pagePath: `/${safeLocale}/travel-stories`
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

  // Fetch blog posts filtered by travel-stories category
  let allPosts: BlogPost[] = [];

  try {
    allPosts = await fetchBlogPosts("travel-stories", activeLocale);
  } catch (error) {
    console.error(`Failed to fetch travel stories for /${locale}/travel-stories:`, error);
  }

  return <TravelStoriesContent initialPosts={allPosts} locale={activeLocale} />;
}