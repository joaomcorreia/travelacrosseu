import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { fetchTravelPages } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    entries.push(
      {
        url: `${siteUrl}/${locale}`,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${siteUrl}/${locale}/destinations`,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${locale}/about`,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${siteUrl}/${locale}/contact`,
        changeFrequency: "monthly",
        priority: 0.3,
      }
    );
  }

  for (const locale of SUPPORTED_LOCALES) {
    try {
      const pages = await fetchTravelPages(locale);

      for (const page of pages) {
        if (!page.slug) continue;

        entries.push({
          url: `${siteUrl}/${locale}/destinations/${page.slug}`,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch pages for sitemap locale=${locale}:`, error);
    }
  }

  return entries;
}
