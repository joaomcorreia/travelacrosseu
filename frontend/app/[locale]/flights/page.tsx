import Link from "next/link";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/locales";

const flightTips = [
  {
    title: "Keep dates flexible",
    description:
      "Shift departure by a day or two to see new fare classes and avoid peak business traffic.",
  },
  {
    title: "Compare nearby airports",
    description:
      "Amsterdam, Brussels, and Düsseldorf often share fare sales—check all three before booking.",
  },
  {
    title: "Balance budget vs. comfort",
    description:
      "Premium economy can be a sweet spot for four-hour flights where carry-on space matters.",
  },
  {
    title: "Plan the return",
    description:
      "Red-eyes land early, which pairs well with late hotel check-ins and extra sightseeing time.",
  },
];

const departureHubs = [
  {
    city: "Amsterdam",
    note: "SkyTeam focus with easy rail transfers between AMS and Rotterdam.",
  },
  {
    city: "Lisbon",
    note: "Great for Portugal + island hops; TAP sells creative stopovers.",
  },
  {
    city: "Paris",
    note: "Dual-airport flexibility (CDG/ORY) keeps fares competitive year-round.",
  },
  {
    city: "Berlin",
    note: "Seasonal routes grow every year, ideal for Central/Eastern EU itineraries.",
  },
];

type FlightsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function FlightsPage({ params }: FlightsPageProps) {
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
              Find flights to your next EU getaway.
            </h1>
            <p className="text-base text-slate-600">
              We surface the research so you can pick smarter routes. TravelAcross is a
              planning companion—bookings stay with airlines or OTA partners once we send you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={destinationsHref}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Browse destinations
                <span aria-hidden="true">&gt;</span>
              </Link>
              <span className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600">
                Flexible dates · Smart hubs
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Flight planning snapshot
            </p>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Sync the flight search window with when you expect new city guides to publish.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Pin fares in your dashboard, then layer on hotels + experiences once dates lock.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Save room for future affiliate widgets (Booking.com, Expedia, etc.).
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-16 sm:px-10 lg:px-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-200">
                How to choose a good flight
              </p>
              <h2 className="text-3xl font-semibold">Four checkpoints before you book.</h2>
            </div>
            <span className="text-sm text-white/70">
              Practical now, dynamic widgets later.
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {flightTips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  Tip
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{tip.title}</h3>
                <p className="mt-2 text-sm text-white/80">{tip.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-16 sm:px-10 lg:px-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Popular departure hubs</h2>
            <span className="text-sm text-white/60">Mix rail + air for smoother journeys.</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {departureHubs.map((hub) => (
              <article
                key={hub.city}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  Hub
                </p>
                <h3 className="mt-2 text-xl font-semibold">{hub.city}</h3>
                <p className="mt-2 text-sm text-white/80">{hub.note}</p>
              </article>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            These hubs double as content anchors—soon we will drop fare widgets and seasonal
            playbooks right here.
          </div>
        </div>
      </section>
    </div>
  );
}
