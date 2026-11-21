import Link from "next/link";
import { HowItWorks } from "@/components/home";
import { ShieldCheck, Search, Wallet } from "lucide-react";

export const metadata = { title: "How it works | MentorLagbe" };

const why = [
  { i: Search, t: "Find the right fit", d: "Filter by subject, class level, mode and budget instead of asking around." },
  { i: ShieldCheck, t: "Moderated listings", d: "Every tuition is reviewed by an admin before it goes public." },
  { i: Wallet, t: "Clear monthly fees", d: "Fees, days per week and location are visible before you apply." },
];

export default function About() {
  return (
    <>
      <section className="container-x py-14">
        <h1 className="section-title">About MentorLagbe</h1>
        <p className="section-sub">Students and parents struggle to find verified tutors, and skilled tutors lack a structured place to showcase batches. MentorLagbe brings both sides into one platform for online and home tuition.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {why.map((w) => (
            <div key={w.t} className="h-full rounded-box border border-base-300 bg-base-100 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><w.i size={24} /></span>
              <h3 className="mt-4 font-display text-lg font-bold">{w.t}</h3>
              <p className="mt-2 text-sm opacity-70">{w.d}</p>
            </div>
          ))}
        </div>
      </section>
      <HowItWorks />
      <section className="container-x py-14 text-center">
        <h2 className="section-title">Ready to start?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/tuitions" className="btn btn-primary">Browse Tuitions</Link>
          <Link href="/sign-up" className="btn btn-outline">Create an account</Link>
        </div>
      </section>
    </>
  );
}
