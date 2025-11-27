import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/locales";

interface FlightsCtaSectionProps {
  locale: Locale;
  variant?: "compact" | "full";
  className?: string;
}

const EXAMPLE_ROUTES = [
  "Lisbon → Barcelona",
  "Amsterdam → Rome", 
  "Paris → Prague"
];

export default function FlightsCtaSection({ 
  locale, 
  variant = "compact", 
  className = "" 
}: FlightsCtaSectionProps) {
  
  if (variant === "full") {
    return (
      <section className={`py-16 sm:py-20 lg:py-24 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Find simple flight options between European cities
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Use flights only when they actually save you time, then join them with trains and local routes.
              </p>
              
              <Link
                href={`/${locale}/flights`}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-lg"
              >
                Check flights & routes
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Popular routes:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_ROUTES.map((route, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="mt-10 lg:mt-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
                <Image
                  src="/images/flights/planes-over-europe.jpg"
                  alt="Planes over Europe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Compact variant (default)
  return (
    <section className={`py-10 sm:py-12 px-4 bg-gradient-to-r from-sky-500 to-indigo-500 ${className}`}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Find simple flight options between European cities
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Use flights only when they actually save you time, then join them with trains and local routes.
        </p>
        
        <Link
          href={`/${locale}/flights`}
          className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold shadow-lg"
        >
          Check flights & routes
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        
        <div className="mt-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
            {EXAMPLE_ROUTES.map((route, index) => (
              <span key={index} className="flex items-center">
                {route}
                {index < EXAMPLE_ROUTES.length - 1 && (
                  <span className="mx-3">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}