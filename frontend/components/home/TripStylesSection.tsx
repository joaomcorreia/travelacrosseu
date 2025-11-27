"use client";

import type { Locale } from "@/lib/locales";

interface TripStylesSectionProps {
  locale: Locale;
  className?: string;
}

const tripStyles = [
  {
    key: "city-breaks",
    title: "City breaks",
    description: "Short, calm city trips with cafés, viewpoints and trams.",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    key: "coastal",
    title: "Coastal & islands",
    description: "Sea views, islands and easy coastal routes.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    key: "train-first",
    title: "Train-first routes",
    description: "Trips built around simple train connections.",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    key: "slow-winter",
    title: "Slow winter escapes",
    description: "Quiet winter trips with lights, cafés and warm stays.",
    gradient: "from-amber-500 to-rose-500",
  },
];

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function TripStylesSection({ locale, className = "" }: TripStylesSectionProps) {
  return (
    <section className={cn("py-10 sm:py-14 lg:py-16", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Pick your trip style
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Different ways to travel across Europe, all built with a calmer pace in mind.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tripStyles.map((style) => (
            <div
              key={style.key}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] h-[320px] sm:h-[360px] lg:h-[400px] p-5 flex items-end",
                "bg-gradient-to-t",
                style.gradient,
                "shadow-lg shadow-slate-900/40 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              )}
            >
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-semibold">{style.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-white/80">
                  {style.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}