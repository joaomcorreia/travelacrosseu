import Link from "next/link";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { isSupportedLocale, type Locale } from "@/lib/locales";

const FALLBACK_COPY = {
  title: "Page not found",
  description:
    "We could not find the page you requested. Return to the homepage or keep exploring curated EU destinations.",
  ctaPrimary: "Return home",
  ctaSecondary: "Browse destinations",
};

interface NotFoundParams {
  locale?: string;
}

interface NotFoundProps {
  params?: Promise<NotFoundParams> | NotFoundParams;
}

export default async function LocaleNotFound({ params }: NotFoundProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const requestedLocale = resolvedParams?.locale;
  const locale: Locale =
    requestedLocale && isSupportedLocale(requestedLocale) ? requestedLocale : "en";
  const dictionary = await getDictionary(locale);
  const copy = {
    title: dictionary.notFound?.title ?? FALLBACK_COPY.title,
    description: dictionary.notFound?.description ?? FALLBACK_COPY.description,
    ctaPrimary: dictionary.notFound?.ctaPrimary ?? FALLBACK_COPY.ctaPrimary,
    ctaSecondary: dictionary.notFound?.ctaSecondary ?? FALLBACK_COPY.ctaSecondary,
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
        404 · {dictionary.layout.siteInitials}
      </p>
      <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
        {copy.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/30 transition hover:bg-slate-100"
        >
          {copy.ctaPrimary}
        </Link>
        <Link
          href={`/${locale}/destinations`}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {copy.ctaSecondary}
        </Link>
      </div>
    </div>
  );
}
