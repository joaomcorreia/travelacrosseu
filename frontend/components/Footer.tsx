import Link from "next/link";
import type { Locale } from "@/lib/locales";
import type { CommonDictionary } from "@/lib/i18n/getDictionary";

const buildHref = (locale: string | undefined, path: string) => {
  if (!locale) {
    return path === "" ? "/" : path;
  }
  if (path === "") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
};

type FooterProps = {
  locale?: Locale | string;
  dictionary: CommonDictionary;
};

export default function Footer({ locale, dictionary }: FooterProps) {
  const rootHref = buildHref(locale, "");
  const { layout, footer } = dictionary;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div>
          {layout.siteTagline && (
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              {layout.siteTagline}
            </p>
          )}
          <p className="mt-2 text-lg font-semibold text-slate-900">{layout.siteTitle}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href={`${rootHref}#privacy`} className="transition hover:text-slate-900">
            {footer.privacy}
          </Link>
          <Link href={`${rootHref}#cookies`} className="transition hover:text-slate-900">
            {footer.cookies}
          </Link>
          <Link
            href={buildHref(locale, "/contact")}
            className="transition hover:text-slate-900"
          >
            {footer.contact}
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-slate-500 md:px-8 lg:px-12">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
