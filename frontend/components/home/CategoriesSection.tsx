"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/locales";
import type { HomepageCategory } from "@/lib/api/homepage";

interface CategoriesSectionProps {
  locale: Locale;
  categories: HomepageCategory[];
  className?: string;
}

type CategoryCardProps = {
  category: HomepageCategory;
  locale: Locale;
  isActive?: boolean;
  onHover?: () => void;
};

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function CategoryCard({ category, locale, isActive, onHover }: CategoryCardProps) {
  // Extract filename from Django URL and use local Next.js path instead
  const getLocalImagePath = (djangoUrl: string | null | undefined): string => {
    if (!djangoUrl || djangoUrl.trim() === "") {
      return "/images/categories/default.jpg";
    }
    
    // If it's already a local path, use it as is
    if (djangoUrl.startsWith("/images/")) {
      return djangoUrl;
    }
    
    // Extract filename from Django media URL
    const filename = djangoUrl.split('/').pop();
    if (filename) {
      return `/images/categories/${filename}`;
    }
    
    return "/images/categories/default.jpg";
  };

  const imageSrc = getLocalImagePath(category.image);

  return (
    <Link
      href={`/${locale}/destinations?category=${category.slug}`}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 text-white block",
        "h-[320px] xl:h-[360px]",
        "transition-all duration-700 ease-out",
        isActive
          ? "scale-[1.08] shadow-2xl shadow-blue-500/50 border-blue-400"
          : "scale-[0.95] shadow-md shadow-slate-900/30 border-slate-800"
      )}
      onMouseEnter={onHover}
    >
      <Image
        src={imageSrc}
        alt={category.title}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold leading-tight">
          {category.title}
        </h3>
        {category.description && (
          <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function CategoriesSection({ locale, categories, className = "" }: CategoriesSectionProps) {
  // Don't render section if no categories available
  if (!categories || categories.length === 0) {
    return null;
  }

  // Data prep
  const featuredCategories = categories.slice(0, 6);
  const topRow = featuredCategories.slice(0, 4);
  const bottomRow = featuredCategories.slice(4);

  // Interactive state for top row
  const [activeIndex, setActiveIndex] = useState(0);

  // Grid column fractions for desktop top row
  const wide = "2.3fr";
  const narrow = "1.1fr";
  const columnFractions = topRow.map((_, idx) => (idx === activeIndex ? wide : narrow));
  const gridTemplateColumns = columnFractions.join(" ");

  return (
    <section className={cn("py-10 sm:py-14 lg:py-16", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Explore by Category
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
            From bustling city centres to coastal retreats, discover your perfect European adventure.
          </p>
        </header>

        {/* Mobile/tablet horizontal swipe slider */}
        <div className="mt-6 flex gap-4 overflow-x-auto lg:hidden snap-x snap-mandatory pb-2">
          {categories.slice(0, 12).map((category) => (
            <div
              key={category.slug}
              className="snap-start shrink-0 w-[220px] sm:w-[260px]"
            >
              <CategoryCard 
                category={category} 
                locale={locale}
              />
            </div>
          ))}
        </div>

        {/* Desktop top row with interactive layout */}
        <div
          className="hidden lg:grid gap-4 mt-6"
          style={{ gridTemplateColumns }}
        >
          {topRow.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              locale={locale}
              isActive={index === activeIndex}
              onHover={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Desktop bottom row */}
        {bottomRow.length > 0 && (
          <div className="hidden lg:block mt-4 lg:mt-6">
            {bottomRow.length === 1 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                  <CategoryCard 
                    category={bottomRow[0]} 
                    locale={locale}
                    isActive 
                  />
                </div>
              </div>
            )}

            {bottomRow.length === 2 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <CategoryCard 
                    category={bottomRow[0]} 
                    locale={locale}
                  />
                </div>
                <div className="col-span-2">
                  <CategoryCard 
                    category={bottomRow[1]} 
                    locale={locale}
                    isActive 
                  />
                </div>
              </div>
            )}

            {/* If later we have 3+ in bottomRow, render them evenly */}
            {bottomRow.length >= 3 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bottomRow.map((category) => (
                  <CategoryCard 
                    key={category.slug} 
                    category={category} 
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All Categories Link */}
        <div className="text-center mt-8 lg:mt-12">
          <Link
            href={`/${locale}/destinations`}
            className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200 font-medium"
          >
            View All Destinations
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}