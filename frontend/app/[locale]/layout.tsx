import type { ReactNode } from "react";
import CmsNavigation from "@/components/cms/Navigation";
import CmsFooter from "@/components/cms/Footer";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { fetchNavigation, fetchFooter } from "@/lib/api/navigation";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const requestedLocale = resolvedParams.locale;
  const locale: Locale = isSupportedLocale(requestedLocale) ? requestedLocale : "en";

  // Fetch CMS navigation and footer data
  const [navigationItems, footerBlocks] = await Promise.all([
    fetchNavigation(locale),
    fetchFooter(locale)
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* CMS-driven Navigation */}
      <CmsNavigation items={navigationItems} locale={locale} />
      
      <main className="flex-1 bg-gradient-to-b from-white via-slate-50/50 to-white">
        {children}
      </main>
      
      {/* CMS-driven Footer */}
      <CmsFooter blocks={footerBlocks} locale={locale} />
    </div>
  );
}
