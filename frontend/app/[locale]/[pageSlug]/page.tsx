import { Metadata } from "next";
import { notFound } from "next/navigation";

import HeroSlider from "@/components/cms/HeroSlider";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchPage, type CmsPagePayload } from "@/lib/api/pages";
import type { Locale } from "@/lib/locales";
import { resolveParams } from "@/lib/resolveParams";
import { buildSeoMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    locale: Locale;
    pageSlug: string;
  }>;
};

// Reserved slugs that should not be handled by this generic route
const RESERVED_SLUGS = [
  "about",
  "contact", 
  "destinations",
  "blog",
  "experiences",
  "flights",
  "hotels"
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, pageSlug } = await resolveParams(params);

  // Skip reserved slugs - let dedicated routes handle them
  if (RESERVED_SLUGS.includes(pageSlug)) {
    return {};
  }

  try {
    const page = await fetchPage(pageSlug, locale);
    
    if (!page) {
      return {};
    }

    return buildSeoMetadata({
      locale,
      slug: pageSlug,
      cmsData: page,
      contentType: 'page',
      pagePath: `/${locale}/${pageSlug}`
    });
  } catch (error) {
    console.error(`Failed to generate metadata for page ${pageSlug}:`, error);
    return {};
  }
}

export default async function GenericCmsPage({ params }: PageProps) {
  const { locale, pageSlug } = await resolveParams(params);

  // Skip reserved slugs - let dedicated routes handle them
  if (RESERVED_SLUGS.includes(pageSlug)) {
    return notFound();
  }

  let page: CmsPagePayload | null;
  
  try {
    page = await fetchPage(pageSlug, locale);
  } catch (error) {
    console.error(`Failed to fetch CMS page ${pageSlug}:`, error);
    return notFound();
  }

  // Return 404 if page doesn't exist or is not published
  if (!page || !page.is_published) {
    return notFound();
  }

  const hasHeroMedia = page.hero_slides.length > 0 || page.hero_image;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {hasHeroMedia && (
          <HeroSlider 
            slides={page.hero_slides} 
            fallbackImage={page.hero_image}
            height="h-96"
          />
        )}
        
        <div className={`${hasHeroMedia ? 'absolute inset-0 flex items-end' : 'bg-gradient-to-b from-blue-50 to-white py-16'}`}>
          <div className="container mx-auto px-6">
            <div className={`${hasHeroMedia ? 'pb-16 text-white' : 'text-slate-900'}`}>
              {page.translation_missing && (
                <div className="mb-4 inline-block rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  Translation not available for {locale}
                </div>
              )}
              
              {page.title && (
                <h1 className="text-4xl font-bold lg:text-5xl">
                  {page.title}
                </h1>
              )}
              
              {page.subtitle && (
                <p className={`mt-4 text-lg ${hasHeroMedia ? 'text-slate-200' : 'text-slate-600'}`}>
                  {page.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {page.body && (
            <div className="prose prose-lg mx-auto max-w-4xl text-slate-700">
              <div dangerouslySetInnerHTML={{ __html: page.body }} />
            </div>
          )}
          
          {/* CMS Sections */}
          {page.sections && page.sections.length > 0 && (
            <div className="mt-16">
              <SectionRenderer sections={page.sections} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}