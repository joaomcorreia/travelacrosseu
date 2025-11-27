import Link from "next/link";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/locales";

const experienceTypes = [
  {
    title: "Food tours",
    description: "Market strolls, chef-led tastings, and regional wine pairings.",
  },
  {
    title: "Museum passes",
    description: "Skip-the-line access paired with curated walking routes.",
  },
  {
    title: "Nature escapes",
    description: "Island ferries, fjord day trips, and alpine rail journeys.",
  },
  {
    title: "Nightlife",
    description: "Cocktail ateliers, late-night jazz bars, and pop-up club residencies.",
  },
  {
    title: "Day trips",
    description: "Pair capital cities with nearby villages for contrast and calm.",
  },
];

const themedIdeas = [
  {
    title: "Design + Architecture",
    bullets: [
      "Copenhagen bike loop featuring modernist landmarks",
      "Bilbao Guggenheim morning followed by pintxos crawl",
    ],
  },
  {
    title: "Coastal weekends",
    bullets: [
      "Lisbon to Cascais surf shuttle",
      "Mallorca Tramuntana scenic drive with markets",
    ],
  },
];

type ExperiencesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ExperiencesPage({ params }: ExperiencesPageProps) {
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
              Make the trip memorable.
            </h1>
            <p className="text-base text-slate-600">
              Experiences are where itineraries come alive. We outline the frameworks today so future
              API integrations with GetYourGuide or local vendors slide right in.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={destinationsHref}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Explore destinations
                <span aria-hidden="true">&gt;</span>
              </Link>
              <span className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600">
                Tours · Culture · Nature
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Experience planning snapshot
            </p>
            <ul className="mt-5 space-y-4 text-sm text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Match daytime and nighttime energy—sunrise markets followed by lantern-lit alleys.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Layer pass-based value (museum bundles, metro cards) to keep logistics lean.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                Reserve one "wild card" slot for spontaneous finds.
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
                Types of experiences
              </p>
              <h2 className="text-3xl font-semibold">Curate by mood, not algorithm.</h2>
            </div>
            <span className="text-sm text-white/70">
              Slots for GetYourGuide + friends coming soon.
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {experienceTypes.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  Experience
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/80">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 sm:px-10 lg:px-0 md:grid-cols-2">
          {themedIdeas.map((idea) => (
            <article
              key={idea.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Theme</p>
              <h3 className="mt-2 text-2xl font-semibold">{idea.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {idea.bullets.map((bullet) => (
                  <li key={bullet} className="list-outside list-disc pl-4">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-16 text-sm text-white/70 sm:px-10 lg:px-0">
          Every block keeps the hybrid aesthetic aligned with the homepage hero → dark feature
          section flow. It is copy-first now, widget-ready later.
        </div>
      </section>
    </div>
  );
}
