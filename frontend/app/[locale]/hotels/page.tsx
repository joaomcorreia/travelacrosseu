import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/BookingWidget";
import { isSupportedLocale } from "@/lib/locales";

const stayZones = [
  {
    title: "Old town",
    description:
      "Atmospheric streets, boutique stays, and instant access to cafés plus evening walks.",
  },
  {
    title: "Near the station",
    description:
      "Perfect when you are chaining rail segments—drop bags and keep moving between cities.",
  },
  {
    title: "Waterfront / beachfront",
    description:
      "Blend leisure with city energy. Sunset boardwalks beat traffic-clogged taxi rides.",
  },
];

const accommodationTypes = [
  {
    label: "Hotel",
    detail: "Reliable service layers, loyalty perks, and 24/7 reception support.",
  },
  {
    label: "Apartment",
    detail: "More space for longer stays or remote work blocks—especially in Lisbon or Valencia.",
  },
  {
    label: "Hostel",
    detail: "Community-first vibes, private pods, and curated experiences for social travelers.",
  },
  {
    label: "Guesthouse",
    detail: "Family-run hospitality, breakfast spreads, and hyper-local recommendations.",
  },
];

type HotelsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HotelsPage({ params }: HotelsPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const destinationsHref = `/${locale}/destinations`;

  return (
    <div className="space-y-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-10 lg:px-0 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              TravelAcross EU · {locale.toUpperCase()}
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Stay where the stories happen.
            </h1>
            <p className="text-base text-slate-600">
              We map neighborhood vibes so your hotel shortlist feels intentional. Soon these
              sections will host live affiliate widgets—today they guide editors on layout and tone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={destinationsHref}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Back to destinations
                <span aria-hidden="true">&gt;</span>
              </Link>
              <span className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600">
                Hotels · Apartments · Guesthouses
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Where to stay in EU cities
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Layer these insights on top of our destination guides. Each card becomes a future slot
              for Booking.com or Expedia modules once we flip on affiliate mode.
            </p>
            <div className="mt-6 grid gap-4">
              {stayZones.map((zone) => (
                <article
                  key={zone.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{zone.title}</h3>
                  <p className="text-sm text-slate-600">{zone.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-16 sm:px-10 lg:px-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-200">
                Accommodation types
              </p>
              <h2 className="text-3xl font-semibold">Pick the format that matches your trip.</h2>
            </div>
            <span className="text-sm text-white/70">
              Editorial now, booking engines later.
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {accommodationTypes.map((type) => (
              <article
                key={type.label}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  Option
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{type.label}</h3>
                <p className="mt-2 text-sm text-white/80">{type.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-14 sm:px-10 lg:px-0">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              Affiliate-ready slot
            </p>
            <h2 className="text-2xl font-semibold">Plan with Booking.com soon.</h2>
            <p className="text-sm text-white/70">
              We sand-box the widget inside its own iframe so you can paste the official CJ embed later
              without rewriting React sections. Until then, the placeholder keeps this area from feeling empty.
            </p>
          </div>
          <BookingWidget />
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:px-10 lg:px-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              Next steps
            </p>
            <h2 className="text-2xl font-semibold">Ready for affiliate modules.</h2>
            <p className="mt-2 text-sm text-white/70">
              Each block mirrors the way we will slot Booking.com widgets or curated partner lists
              once approvals land. Until then, it acts as a polished placeholder.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
            We keep copy in English for now, but the layout respects every locale route and stays in
            sync with the language switcher. Translating the text becomes a straightforward AI pass.
          </div>
        </div>
      </section>
    </div>
  );
}
