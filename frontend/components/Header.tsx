import Link from "next/link";
import LanguageSwitcher, { type LanguageOption } from "./LanguageSwitcher";
import {
  SUPPORTED_LOCALES,
  getLocaleLabel,
  isSupportedLocale,
  type Locale,
} from "@/lib/locales";
import type { CommonDictionary } from "@/lib/i18n/getDictionary";

type HeaderProps = {
  locale?: Locale | string;
  dictionary: CommonDictionary;
};

type NavKey = "home" | "destinations" | "blog" | "about" | "contact";

const navLinks: Array<{ key: NavKey; path: string }> = [
  { key: "home", path: "" },
  { key: "destinations", path: "/destinations" },
  { key: "blog", path: "/destinations" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
];

const buildHref = (locale: string | undefined, path: string) => {
  if (!locale) {
    return path === "" ? "/" : path;
  }
  const normalized = path || "";
  return normalized === "" ? `/${locale}` : `/${locale}${normalized}`;
};

export default function Header({ locale, dictionary }: HeaderProps) {
  const normalizedLocale =
    typeof locale === "string" && isSupportedLocale(locale) ? locale : "en";
  const { layout, nav } = dictionary;

  const languageOptions: LanguageOption[] = SUPPORTED_LOCALES.map((code) => ({
    locale: code,
    label: getLocaleLabel(code),
    href: `/${code}`,
    available: true,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
        <Link href={buildHref(locale, "")} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-200/50">
            {layout.siteInitials}
          </div>
          <div className="leading-tight">
            {layout.siteTagline && (
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                {layout.siteTagline}
              </p>
            )}
            <p className="text-lg font-semibold text-slate-900">{layout.siteTitle}</p>
          </div>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-600 md:justify-end">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={buildHref(locale, link.path)}
              className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {nav[link.key]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher
            currentLocale={normalizedLocale}
            options={languageOptions}
            variant="compact"
            title={nav.languageMenu}
          />
          <Link
            href={buildHref(locale, "/destinations")}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
          >
            {nav.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
