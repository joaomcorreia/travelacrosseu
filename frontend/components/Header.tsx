"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher, { type LanguageOption } from "./LanguageSwitcher";
import {
  SUPPORTED_LOCALES,
  getLocaleLabel,
  isSupportedLocale,
  type Locale,
} from "@/lib/locales";
import { buildSectionUrl, type SectionKey } from "@/lib/localized-slugs";
import type { CommonDictionary } from "@/lib/i18n/getDictionary";

type HeaderProps = {
  locale?: Locale | string;
  dictionary: CommonDictionary;
};

type NavKey = "home" | "destinations" | "blog" | "about" | "contact";

const navLinks: Array<{ key: NavKey; sectionKey?: SectionKey; isHome?: boolean }> = [
  { key: "home", isHome: true },
  { key: "destinations", sectionKey: "destinations" },
  { key: "blog", sectionKey: "blog" },
  { key: "about", sectionKey: "about" },
  { key: "contact", sectionKey: "contact" },
];

const buildHref = (locale: string | undefined, sectionKey?: SectionKey, isHome?: boolean) => {
  if (!locale) {
    return "/";
  }
  if (isHome) {
    return `/${locale}`;
  }
  if (sectionKey) {
    return buildSectionUrl(sectionKey, locale as Locale);
  }
  return `/${locale}`;
};

export default function Header({ locale, dictionary }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const normalizedLocale =
    typeof locale === "string" && isSupportedLocale(locale) ? locale : "en";
  const { layout, nav } = dictionary;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languageOptions: LanguageOption[] = SUPPORTED_LOCALES.map((code) => ({
    locale: code,
    label: getLocaleLabel(code),
    href: `/${code}`,
    available: true,
  }));

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? "border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur shadow-sm" 
        : "bg-transparent text-white"
    }`}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
        <Link href={buildHref(locale, undefined, true)} className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold shadow-lg transition-all ${
            isScrolled 
              ? "bg-blue-100 text-blue-700 shadow-blue-200/50" 
              : "bg-white/20 text-white shadow-black/20"
          }`}>
            {layout.siteInitials}
          </div>
          <div className="leading-tight">
            {layout.siteTagline && (
              <p className={`text-xs uppercase tracking-[0.4em] transition-colors ${
                isScrolled ? "text-slate-500" : "text-white/70"
              }`}>
                {layout.siteTagline}
              </p>
            )}
            <p className={`text-lg font-semibold transition-colors ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}>{layout.siteTitle}</p>
          </div>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-3 text-sm font-medium md:justify-end">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={buildHref(locale, link.sectionKey, link.isHome)}
              className={`rounded-full px-4 py-2 transition-all ${
                isScrolled 
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900" 
                  : "text-white/80 hover:bg-white/20 hover:text-white"
              }`}
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
            className={isScrolled 
              ? "border border-slate-300 bg-white text-slate-600 hover:border-slate-400" 
              : "border border-white/30 bg-white/20 text-white hover:border-white/50"
            }
          />
          <Link
            href={buildHref(locale, "destinations")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition-all ${
              isScrolled 
                ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" 
                : "bg-white text-blue-600 shadow-black/20 hover:bg-white/90"
            }`}
          >
            {nav.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
