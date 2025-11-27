import Image from "next/image";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchPage, type CmsPagePayload } from "@/lib/api/pages";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { isSupportedLocale } from "@/lib/locales";
import { buildStaticPageMetadata } from "@/lib/seo";
import { resolveParams } from "@/lib/resolveParams";

type AboutPageProps = {
  params:
    | Promise<{
        locale: string;
      }>
    | {
        locale: string;
      };
};

const FALLBACK_ABOUT_COPY = {
  title: "About TravelAcross EU",
  subtitle: "AI-assisted travel publishing built for multilingual teams.",
  body: `TravelAcross EU is an AI-assisted travel content project focused on showcasing thoughtfully structured guides for European destinations. The platform mixes editorial standards with automation, so travelers can quickly explore countries, cities, and themed collections that feel ready for publication.

The project is still in an early phase. Layouts, languages, and features will keep evolving as we learn from editors and travelers. Expect frequent iterations as we refine the CMS, improve localization, and publish more demo itineraries.`,
};



export async function generateMetadata({
  params,
}: {
  params: AboutPageProps["params"];
}) {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Try to fetch CMS content for SEO metadata
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("about", safeLocale);
  } catch (error) {
    console.warn("Failed to fetch CMS about page for SEO metadata:", error);
  }

  return buildStaticPageMetadata(safeLocale, "about", cmsPage || undefined);
}

function renderParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${paragraph.slice(0, 16)}-${index}`} className="text-base text-white/80">
        {paragraph}
      </p>
    ));
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await resolveParams(params);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("about", locale);
  } catch (error) {
    console.error(`Failed to load CMS page 'about' for /${locale}:`, error);
  }

  const title = cmsPage?.title?.trim() || FALLBACK_ABOUT_COPY.title;
  const subtitle = cmsPage?.subtitle?.trim() || FALLBACK_ABOUT_COPY.subtitle;
  const body = cmsPage?.body?.trim() || FALLBACK_ABOUT_COPY.body;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Image Section */}
      {cmsPage?.hero_image && (
        <section className="relative h-64 w-full overflow-hidden">
          <Image
            src={cmsPage.hero_image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </section>
      )}

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 sm:px-10 lg:px-0">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            {dictionary.nav.about ?? "About"} · {locale.toUpperCase()}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="text-base text-white/80">{subtitle}</p>
        </header>

        {renderParagraphs(body)}

        {/* CMS Sections */}
        {cmsPage?.sections && cmsPage.sections.length > 0 && (
          <SectionRenderer sections={cmsPage.sections} />
        )}

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-white/80">
          <p className="font-semibold text-white">{dictionary.layout.siteTitle}</p>
          <p className="mt-2 text-white/70">
            {cmsPage?.translation_missing
              ? "Showing default English copy until this locale is translated in the CMS."
              : "Manage this section directly from the CMS to highlight roadmap updates."}
          </p>
        </div>
      </main>
    </div>
  );
}
