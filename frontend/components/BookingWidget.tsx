"use client";

import { useState } from "react";

export function BookingWidget() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-6 shadow-inner">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Hotel search
          </h2>
          <p className="text-xs text-slate-400 sm:text-sm">
            Powered by our affiliate partner. Use this widget to discover hotel options near your chosen
            destination.
          </p>
        </div>
        {!loaded && (
          <span className="mt-2 inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300 sm:mt-0">
            Loading widget…
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black/40">
        <iframe
          src="/booking-hotels-widget.html"
          title="Booking.com hotels widget"
          className="h-[320px] w-full"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Note: availability, prices, and booking flows are provided by the affiliate partner and may vary by region.
        TravelAcross EU is a discovery layer and does not handle payments directly.
      </p>
    </section>
  );
}
