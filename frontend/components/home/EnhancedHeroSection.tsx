"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { CmsPagePayload } from "@/lib/api/pages";
import type { Locale } from "@/lib/locales";

interface EnhancedHeroSectionProps {
  locale: Locale;
  cmsData?: CmsPagePayload | null;
  className?: string;
}

// Static hero images for the slider
const HERO_IMAGES = [
  "/images/hero/europe-hero.jpg",
  "/images/hero/test-slider.jpg",
  "/images/hero/plane-takeoff-fallback.jpg"
];

export default function EnhancedHeroSection({ locale, cmsData, className = "" }: EnhancedHeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance the hero slider (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % HERO_IMAGES.length
      );
    }, 3000); // Change image every 3 seconds for quicker testing

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section 
      className={`relative overflow-hidden min-h-[500px] flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundColor: '#1e293b' }} // Fallback background
    >
      {/* Background Images Container */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`TravelAcross EU Hero ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
            unoptimized // Disable optimization to help with debugging
          />
        ))}
      </div>
      
      {/* Gradient Overlay - Made much lighter for better visibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/30 via-slate-900/20 to-slate-950/40" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            TravelAcross EU – Simple guides for real European trips
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-200 mb-4 leading-relaxed">
            Pick a country, choose a few cities and build a calm European trip that actually fits your time.
          </p>
          
          {/* Debug info */}
          <div className="bg-black/70 text-white p-3 rounded mb-6 text-sm border border-yellow-300">
            <strong>Hero Slider Status:</strong> Image {currentImageIndex + 1} of {HERO_IMAGES.length}
            <br/><strong>Current Image:</strong> {HERO_IMAGES[currentImageIndex]}
            {isHovered && <span className="text-yellow-300"> [PAUSED ON HOVER]</span>}
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Primary CTA */}
            <Link
              href={`/${locale}/countries`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200 shadow-lg group"
            >
              Browse countries
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Secondary CTA */}
            <Link
              href={`/${locale}/cities`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transform hover:-translate-y-1 transition-all duration-200 group"
            >
              Start with cities
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs sm:text-sm text-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-200/80 rounded-full"></span>
              <span>27+ countries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-200/80 rounded-full"></span>
              <span>6 languages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-200/80 rounded-full"></span>
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to hero image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}