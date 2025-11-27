import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] bg-slate-950 px-6 py-16 text-center text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-white/70">
          The page you are looking for does not exist or may have moved. Head back to the
          homepage or explore destinations to keep planning your next trip.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/en"
            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/60"
          >
            Go to homepage
          </Link>
          <Link
            href="/en/destinations"
            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/60"
          >
            Browse destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
