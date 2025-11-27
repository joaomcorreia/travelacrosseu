import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/locales";

interface QuickIdeasStripProps {
  locale: Locale;
  className?: string;
}

const QUICK_IDEAS = [
  {
    id: "lisbon-porto-6d",
    title: "Lisbon + Porto",
    subtitle: "6 days between viewpoints and riversides",
    image: "/images/quick-ideas/lisbon-porto.jpg",
    href: "/en/destinations?route=lisbon-porto"
  },
  {
    id: "barcelona-valencia-5d",
    title: "Barcelona + Valencia",
    subtitle: "5 days mixing city and sea",
    image: "/images/quick-ideas/barcelona-valencia.jpg",
    href: "/en/destinations?route=barcelona-valencia"
  },
  {
    id: "paris-lyon-5d",
    title: "Paris + Lyon",
    subtitle: "5 days of food, rivers and city walks",
    image: "/images/quick-ideas/paris-lyon.jpg",
    href: "/en/destinations?route=paris-lyon"
  },
  {
    id: "amsterdam-berlin-7d",
    title: "Amsterdam + Berlin",
    subtitle: "7 days linking canals and big-city energy",
    image: "/images/quick-ideas/amsterdam-berlin.jpg",
    href: "/en/destinations?route=amsterdam-berlin"
  }
];

export default function QuickIdeasStrip({ locale, className = "" }: QuickIdeasStripProps) {
  return (
    <section className={`py-10 sm:py-12 bg-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Quick ideas this month
            </h2>
            <p className="text-gray-600">
              Popular multi-city routes that work well together
            </p>
          </div>
          <Link
            href={`/${locale}/destinations`}
            className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all routes →
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {QUICK_IDEAS.map((idea) => (
            <Link
              key={idea.id}
              href={idea.href}
              className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] rounded-2xl border border-slate-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition group flex-shrink-0"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-200">
                <Image
                  src={idea.image}
                  alt={idea.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  {idea.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {idea.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="text-center mt-6 sm:hidden">
          <Link
            href={`/${locale}/destinations`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all routes →
          </Link>
        </div>
      </div>
    </section>
  );
}