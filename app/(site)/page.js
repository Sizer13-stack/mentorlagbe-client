import Link from "next/link";
import { Hero, HowItWorks, Subjects, PlatformStats, Testimonials } from "@/components/home";
import PricingCards from "@/components/PricingCards";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

async function get(path) {
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, { cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [latest, stats] = await Promise.all([get("/tuitions/latest"), get("/stats/public")]);
  return (
    <>
      <Hero />

      <section className="section">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Featured tuitions</h2>
              <p className="section-sub">The six newest approved batches, fresh from our tutors.</p>
            </div>
            <Link href="/tuitions" className="btn btn-outline btn-sm">View all tuitions</Link>
          </div>
          <div className="mt-10">
            {latest?.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{latest.map((t) => <TuitionCard key={t._id} t={t} />)}</div>
            ) : (
              <EmptyState title="No tuitions to show yet" text="New batches appear here as soon as an admin approves them." />
            )}
          </div>
        </div>
      </section>

      <section className="section bg-base-200">
        <div className="container-x">
          <h2 className="section-title">Simple pricing for tutors and students</h2>
          <p className="section-sub">Start free. Upgrade to Pro with Stripe whenever you need more.</p>
          <div className="mt-10"><PricingCards /></div>
        </div>
      </section>

      <HowItWorks />
      <Subjects subjects={stats?.subjects} />
      <PlatformStats stats={stats} />
      <Testimonials />
    </>
  );
}
