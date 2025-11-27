import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "../HomePage";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchTravelPages, type TravelPage } from "@/lib/api";
import { fetchPage, type CmsPagePayload } from "@/lib/api/pages";
import { fetchHomepageCategories, type HomepageCategory } from "@/lib/api/homepage";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { isSupportedLocale } from "@/lib/locales";
import { buildHomeMetadata } from "@/lib/seo";
import { resolveParams } from "@/lib/resolveParams";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }> | {
    locale: string;
  };
};

const FALLBACK_SEO = {
  title: "TravelAcross EU — AI travel guides for every EU locale",
  description:
    "Plan city breaks, coastal escapes, and cultural trips with AI-generated guides in five EU languages.",
};



export async function generateMetadata({
  params,
}: {
  params: LocalePageProps["params"];
}): Promise<Metadata> {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Try to fetch CMS content for SEO metadata
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("home", safeLocale);
  } catch (error) {
    // Fall back to defaults if CMS fails
    console.warn("Failed to fetch CMS page for SEO metadata:", error);
  }

  // Use the SEO helper to build comprehensive metadata
  return buildHomeMetadata(safeLocale, cmsPage || undefined);
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await resolveParams(params);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  let destinations: TravelPage[] = [];
  let homepageContent: CmsPagePayload | null = null;
  let homepageCategories: HomepageCategory[] = [];

  try {
    destinations = await fetchTravelPages(locale);
  } catch (error) {
    console.error(`Failed to fetch destinations for /${locale}:`, error);
  }

  try {
    homepageContent = await fetchPage("home", locale);
  } catch (error) {
    console.error(`Failed to fetch CMS homepage for /${locale}:`, error);
  }

  try {
    homepageCategories = await fetchHomepageCategories(locale);
  } catch (error) {
    console.error(`Failed to fetch homepage categories for /${locale}:`, error);
  }

  const dictionary = await getDictionary(locale);

  return (
    <HomePage
      locale={locale}
      destinations={destinations}
      messages={dictionary.home}
      cmsHomepage={homepageContent}
      categories={homepageCategories}
    />
  );
}
