import Link from "next/link";
import type { Locale } from "@/lib/locales";

export type LanguageOption = {
  locale: Locale;
  label: string;
  href: string;
  available: boolean;
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  options: LanguageOption[];
  variant?: "compact" | "panel";
  title?: string;
};

const DEFAULT_TITLE = "Languages";

export default function LanguageSwitcher({
  currentLocale,
  options,
  variant = "compact",
  title = DEFAULT_TITLE,
}: LanguageSwitcherProps) {
  const activeOption = options.find((option) => option.locale === currentLocale);

  if (variant === "panel") {
    const availableCount = options.filter((option) => option.available).length;

    return (
      <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-white">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
          <span>{title}</span>
          <span className="tracking-normal text-sm font-semibold text-white">
            {activeOption?.label ?? currentLocale.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) =>
            option.available ? (
              <Link
                key={option.locale}
                href={option.href}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  option.locale === currentLocale
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
                aria-current={option.locale === currentLocale ? "true" : undefined}
              >
                {option.label}
              </Link>
            ) : (
              <span
                key={option.locale}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/40"
                aria-disabled="true"
              >
                {option.label}
              </span>
            )
          )}
        </div>
        <p className="text-xs text-white/60">
          {availableCount} / {options.length} languages ready for this guide.
        </p>
      </div>
    );
  }

  return (
    <details className="group relative [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-400 focus:outline-none">
        <span className="text-slate-900">
          {(activeOption?.locale ?? currentLocale).toUpperCase()}
        </span>
        <span className="text-slate-400">▼</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {title}
        </p>
        <div className="flex flex-col">
          {options.map((option) =>
            option.available ? (
              <Link
                key={option.locale}
                href={option.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  option.locale === currentLocale
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                aria-current={option.locale === currentLocale ? "true" : undefined}
              >
                <span>{option.label}</span>
                <span className="text-xs text-slate-400">
                  {option.locale.toUpperCase()}
                </span>
              </Link>
            ) : (
              <span
                key={option.locale}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-400"
                aria-disabled="true"
              >
                <span>{option.label}</span>
                <span>Coming soon</span>
              </span>
            )
          )}
        </div>
      </div>
    </details>
  );
}
