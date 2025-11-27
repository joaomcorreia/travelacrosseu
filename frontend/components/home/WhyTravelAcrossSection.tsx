"use client";

import Image from "next/image";
import type { Locale } from "@/lib/locales";

interface WhyTravelAcrossSectionProps {
  locale: Locale;
  className?: string;
}

export default function WhyTravelAcrossSection({ locale, className = "" }: WhyTravelAcrossSectionProps) {
  const stats = [
    { number: "500K+", label: "Happy Travelers" },
    { number: "200+", label: "Destinations" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <section className={`py-20 bg-slate-950 text-white overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content & Stats */}
          <div className="space-y-8">
            {/* Main Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Why Choose
                <br />
                <span className="text-blue-400">TravelAcross EU</span>
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Join thousands of travelers who trust us to create unforgettable European adventures. 
                From hidden gems to iconic destinations, we make your dream trip a reality.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a
                href={`/${locale}/destinations`}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200"
              >
                Start Your Journey
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side - Circular Photo Collage */}
          <div className="relative h-[500px] lg:h-[600px]">
            {/* Background Gradient Circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transform scale-110" />
            
            {/* Photo Circles */}
            {/* Large Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src="/images/hero/europe-hero.jpg"
                alt="European destination"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Left Circle */}
            <div className="absolute top-8 left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <Image
                src="/images/destinations/featured-1.jpg"
                alt="European city"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Right Circle */}
            <div className="absolute top-12 right-4 w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <Image
                src="/images/destinations/featured-2.jpg"
                alt="European landscape"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Left Circle */}
            <div className="absolute bottom-16 left-4 w-36 h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <Image
                src="/images/destinations/featured-3.jpg"
                alt="European culture"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Right Circle */}
            <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <Image
                src="/images/destinations/featured-large.jpg"
                alt="European architecture"
                fill
                className="object-cover"
              />
            </div>

            {/* Small accent circles */}
            <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
              <Image
                src="/images/hero/plane-takeoff-fallback.jpg"
                alt="European experience"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}