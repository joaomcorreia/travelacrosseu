'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Using simple SVG icons instead of heroicons for compatibility
import type { NavigationItem } from '@/lib/api/navigation';
import type { Locale } from '@/lib/locales';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationProps {
  items: NavigationItem[];
  locale: Locale;
}

export default function Navigation({ items, locale }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === `/${locale}` && pathname === `/${locale}`) {
      return true;
    }
    if (href !== `/${locale}` && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex-shrink-0 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors"
          >
            TravelAcrossEU
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-4">
            <div className="flex items-baseline space-x-4">
              {items.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={`${item.href}-${item.order}`}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
            
          {/* Language Switcher - Desktop (Right side) */}
          <div className="hidden md:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Navigation Links */}
            {items.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={`mobile-${item.href}-${item.order}`}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Language Switcher - Mobile */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Language
                </span>
              </div>
              <div className="px-3">
                <LanguageSwitcher 
                  currentLocale={locale} 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}