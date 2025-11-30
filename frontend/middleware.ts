import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LOCALES } from '@/lib/locales';
import { LOCALIZED_SLUGS, getSectionFromSlug, getLocalizedSlug, type SectionKey } from '@/lib/localized-slugs';

// Generate reverse mappings for redirects (translated slug -> English slug)
const REVERSE_TRANSLATIONS: Record<string, Record<string, string>> = {};
SUPPORTED_LOCALES.forEach(locale => {
  if (locale === 'en') return; // Skip English
  
  REVERSE_TRANSLATIONS[locale] = {};
  Object.entries(LOCALIZED_SLUGS).forEach(([sectionKey, localeMap]) => {
    const englishSlug = localeMap.en;
    const translatedSlug = localeMap[locale as keyof typeof localeMap];
    if (translatedSlug && translatedSlug !== englishSlug) {
      REVERSE_TRANSLATIONS[locale][translatedSlug] = englishSlug;
    }
  });
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip if this is not a locale-specific path
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!localeMatch) {
    return NextResponse.next();
  }

  const [, locale, path = ''] = localeMatch;
  
  // Skip if locale is not supported
  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    return NextResponse.next();
  }

  // Skip if this is English (no translation needed)
  if (locale === 'en') {
    return NextResponse.next();
  }

  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) {
    return NextResponse.next();
  }

  const firstSegment = segments[0];
  
  // Check if we have a reverse translation (translated slug -> English slug)
  const reverseTranslations = REVERSE_TRANSLATIONS[locale] || {};
  if (reverseTranslations[firstSegment]) {
    // This is a translated URL, rewrite to the English equivalent
    const englishSegment = reverseTranslations[firstSegment];
    const newPath = `/${locale}/${englishSegment}` + (segments.length > 1 ? '/' + segments.slice(1).join('/') : '');
    
    console.log(`Rewriting translated URL: ${pathname} -> ${newPath}`);
    
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|robots.txt|sitemap.xml).*)',
  ],
};