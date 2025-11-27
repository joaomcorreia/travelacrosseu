import Image from "next/image";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchPage, type CmsPagePayload } from "@/lib/api/pages";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { isSupportedLocale } from "@/lib/locales";
import { buildStaticPageMetadata } from "@/lib/seo";
import { resolveParams } from "@/lib/resolveParams";

type ContactPageProps = {
  params:
    | Promise<{
        locale: string;
      }>
    | {
        locale: string;
      };
};

const FALLBACK_CONTACT_COPY = {
  title: "Contact",
  subtitle: "Reach the TravelAcross EU core team via email while the support flow is in progress.",
  body: `TravelAcross EU is currently in an early access phase. For now, please reach out by email if you have questions about the roadmap, collaboration opportunities, or demo content.

A dedicated contact form and support flow will be added in a later phase.`,
};



export async function generateMetadata({
  params,
}: {
  params: ContactPageProps["params"];
}) {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Try to fetch CMS content for SEO metadata
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("contact", safeLocale);
  } catch (error) {
    console.warn("Failed to fetch CMS contact page for SEO metadata:", error);
  }

  return buildStaticPageMetadata(safeLocale, "contact", cmsPage || undefined);
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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await resolveParams(params);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("contact", locale);
  } catch (error) {
    console.error(`Failed to load CMS page 'contact' for /${locale}:`, error);
  }

  const title = cmsPage?.title?.trim() || FALLBACK_CONTACT_COPY.title;
  const subtitle = cmsPage?.subtitle?.trim() || FALLBACK_CONTACT_COPY.subtitle;
  const body = cmsPage?.body?.trim() || FALLBACK_CONTACT_COPY.body;

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
            {dictionary.nav.contact ?? "Contact"} · {locale.toUpperCase()}
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
          <p>
            <span className="font-semibold text-white">Email:</span> info@travelacross.eu
          </p>
          <p className="mt-2 text-xs text-white/60">
            {cmsPage?.translation_missing
              ? "Add translations in Django admin to localize this contact block."
              : "Support form and help center integrations will land in a later phase."}
          </p>
        </div>
      </main>
    </div>
  );
}
