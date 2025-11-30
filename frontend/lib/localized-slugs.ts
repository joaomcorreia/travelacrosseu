import { Locale } from './locales';

// Section keys for internal reference
export type SectionKey = 'travelStories' | 'tripIdeas' | 'blog' | 'cities' | 'destinations' | 'about' | 'contact';

// Localized URL segments for each section
export const LOCALIZED_SLUGS: Record<SectionKey, Record<Locale, string>> = {
  travelStories: {
    en: 'travel-stories',
    pt: 'historias-de-viagem',
    fr: 'recits-de-voyage',
    nl: 'reisverhalen',
    es: 'historias-de-viaje'
  },
  tripIdeas: {
    en: 'trip-ideas',
    pt: 'ideias-de-viagem',
    fr: 'idees-de-voyage',
    nl: 'reis-ideeen',
    es: 'ideas-de-viaje'
  },
  blog: {
    en: 'blog',
    pt: 'blog',
    fr: 'blog',
    nl: 'blog',
    es: 'blog'
  },
  cities: {
    en: 'cities',
    pt: 'cidades',
    fr: 'villes',
    nl: 'steden',
    es: 'ciudades'
  },
  destinations: {
    en: 'destinations',
    pt: 'destinos',
    fr: 'destinations',
    nl: 'bestemmingen',
    es: 'destinos'
  },
  about: {
    en: 'about',
    pt: 'sobre',
    fr: 'a-propos',
    nl: 'over',
    es: 'acerca-de'
  },
  contact: {
    en: 'contact',
    pt: 'contato',
    fr: 'contact',
    nl: 'contact',
    es: 'contacto'
  }
};

// Reverse mapping: localized slug -> section key
const SLUG_TO_SECTION: Record<string, SectionKey> = {};
Object.entries(LOCALIZED_SLUGS).forEach(([sectionKey, localeMap]) => {
  Object.values(localeMap).forEach(slug => {
    SLUG_TO_SECTION[slug] = sectionKey as SectionKey;
  });
});

/**
 * Get the localized URL segment for a section in a specific locale
 */
export function getLocalizedSlug(sectionKey: SectionKey, locale: Locale): string {
  return LOCALIZED_SLUGS[sectionKey][locale];
}

/**
 * Get the section key from a localized URL segment
 */
export function getSectionFromSlug(slug: string): SectionKey | null {
  return SLUG_TO_SECTION[slug] || null;
}

/**
 * Build a localized URL path for a section
 */
export function buildSectionUrl(sectionKey: SectionKey, locale: Locale): string {
  const localizedSlug = getLocalizedSlug(sectionKey, locale);
  return `/${locale}/${localizedSlug}`;
}

/**
 * Check if a slug is valid for any locale
 */
export function isValidSectionSlug(slug: string): boolean {
  return slug in SLUG_TO_SECTION;
}

/**
 * Get the canonical section key that maps to the Page model slug
 * This is used to fetch the correct Page/PageTranslation from Django
 */
export function getCanonicalPageSlug(sectionKey: SectionKey): string {
  // Map section keys to the actual Page model slugs in Django
  const pageSlugMap: Record<SectionKey, string> = {
    travelStories: 'travel-stories',  // Will create this Page
    tripIdeas: 'trip-ideas',          // Will create this Page  
    blog: 'blog',                     // Already exists
    cities: 'cities',                 // Already exists
    destinations: 'destinations',     // Already exists
    about: 'about',                   // Already exists
    contact: 'contact'                // Already exists
  };
  
  return pageSlugMap[sectionKey];
}