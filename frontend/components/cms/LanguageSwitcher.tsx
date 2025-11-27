'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/lib/locales';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

interface TranslationResponse {
  found: boolean;
  url: string;
  reason: string;
}

interface LanguageSwitcherProps {
  currentLocale: Locale;
  availableLocales?: Locale[];
  className?: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  nl: 'NL',
  es: 'ES',
  pt: 'PT'
};

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
  es: 'Español',
  pt: 'Português'
};

export default function LanguageSwitcher({ 
  currentLocale, 
  availableLocales = ['en', 'fr', 'nl', 'es', 'pt'],
  className = ''
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [translationUrls, setTranslationUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect content type and slug from current path
  const detectContentInfo = (path: string) => {
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 1) {
      // Root or locale-only path
      return { contentType: 'home', slug: '' };
    }
    
    const [locale, ...segments] = pathParts;
    
    if (segments.length === 0) {
      return { contentType: 'home', slug: '' };
    }
    
    const firstSegment = segments[0];
    
    // Static pages
    if (['about', 'contact', 'privacy', 'terms', 'cookies'].includes(firstSegment)) {
      return { contentType: 'static', slug: firstSegment };
    }
    
    // Destinations
    if (firstSegment === 'destinations') {
      return { contentType: 'destination', slug: segments.join('/') };
    }
    
    // Blog
    if (firstSegment === 'blog') {
      if (segments.length === 1) {
        return { contentType: 'blog', slug: 'index' };
      } else if (segments[1] === 'category' && segments[2]) {
        return { contentType: 'blog_category', slug: segments[2] };
      } else if (segments[1]) {
        return { contentType: 'blog_post', slug: segments[1] };
      }
      return { contentType: 'blog', slug: 'index' };
    }
    
    // Generic CMS pages
    return { contentType: 'page', slug: firstSegment };
  };

  // Resolve translation for a target locale
  const resolveTranslation = async (targetLocale: Locale): Promise<string> => {
    const { contentType, slug } = detectContentInfo(pathname);
    
    try {
      const params = new URLSearchParams({
        slug: slug,
        content_type: contentType,
        locale: targetLocale,
        current_path: pathname
      });
      
      const response = await fetch(`${BASE_URL}/api/cms/resolve-translation/?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to resolve translation');
      }
      
      const data: TranslationResponse = await response.json();
      return data.url;
    } catch (error) {
      console.warn(`Failed to resolve translation for ${targetLocale}:`, error);
      return `/${targetLocale}/`;
    }
  };

  // Load translations when dropdown opens
  const handleDropdownToggle = async () => {
    if (!isOpen && Object.keys(translationUrls).length === 0) {
      setIsLoading(true);
      
      const promises = availableLocales.map(async (locale) => {
        if (locale === currentLocale) {
          return [locale, pathname];
        }
        const url = await resolveTranslation(locale);
        return [locale, url];
      });
      
      try {
        const results = await Promise.all(promises);
        const urlMap = Object.fromEntries(results);
        setTranslationUrls(urlMap);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsOpen(!isOpen);
  };

  // Handle locale selection
  const handleLocaleSelect = (locale: Locale) => {
    const targetUrl = translationUrls[locale] || `/${locale}/`;
    router.push(targetUrl);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Switcher Button */}
      <button
        type="button"
        onClick={handleDropdownToggle}
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-gray-900">{LOCALE_LABELS[currentLocale]}</span>
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                Loading...
              </div>
            ) : (
              availableLocales.map((locale) => {
                const isCurrentLocale = locale === currentLocale;
                const targetUrl = translationUrls[locale];
                
                return (
                  <button
                    key={locale}
                    onClick={() => handleLocaleSelect(locale)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      isCurrentLocale
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    disabled={isCurrentLocale}
                  >
                    <div className="flex items-center justify-between">
                      <span>{LOCALE_NAMES[locale]}</span>
                      <span className="text-xs text-gray-500">
                        {LOCALE_LABELS[locale]}
                      </span>
                    </div>
                    {targetUrl && !isCurrentLocale && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {targetUrl}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}