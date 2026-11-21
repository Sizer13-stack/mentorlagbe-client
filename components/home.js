"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import { Search, UserPlus, FilePlus2, Send, GraduationCap, BadgeCheck, Calculator, Atom, Code2, Languages, FlaskConical, Dna, BookOpen, Laptop, Landmark, PenLine, Users, Library, ClipboardCheck, Quote } from "lucide-react";
import { Stars } from "./ui";

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (e) => { e.preventDefault(); router.push(q.trim() ? `/tuitions?search=${encodeURIComponent(q.trim())}` : "/tuitions"); };
  const tickets = [
    { t: "HSC Higher Math Batch", m: "Online · 3 days/week", p: "৳3,500", n: "Rafiq Ahmed", i: Calculator, r: "-4deg", d: "0.1s", c: "left-0 top-4" },
    { t: "IELTS Band 7+ Preparation", m: "Online · 4 days/week", p: "৳6,000", n: "Farhana Islam", i: Languages, r: "3deg", d: "0.3s", c: "right-0 top-[8.5rem]" },
    { t: "SSC Physics Crash Course", m: "Dhanmondi · 3 days/week", p: "৳3,000", n: "Rafiq Ahmed", i: Atom, r: "-2deg", d: "0.5s", c: "left-10 top-[17rem]" },
  ];
  return (
    <section className="notebook text-white">
      <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Find Your Ideal Tutor or Mentorship Batch Today</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">Search verified tutors by subject, class level, mode and monthly budget. Apply in two minutes and track every application in one place.</p>
          <form onSubmit={go} className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 px-3 text-neutral">
              <Search size={18} className="shrink-0 opacity-60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “Physics” or “IELTS”" className="h-11 w-full bg-transparent outline-none placeholder:text-neutral/50" />
            </label>
            <button className="btn btn-accent">Browse Tuitions</button>
          </form>
          <p className="mt-5 text-sm text-white/70">
            Popular: {["Mathematics", "Physics", "Programming", "IELTS"].map((s, i) => (
              <span key={s}><Link href={`/tuitions?subject=${s}`} className="underline decoration-white/30 underline-offset-4 hover:decoration-accent">{s}</Link>{i < 3 ? ", " : ""}</span>
            ))}
          </p>
          <p className="mt-6 text-sm text-white/70">Teaching a subject? <Link href="/sign-up" className="font-semibold text-accent underline-offset-4 hover:underline">Post your batch as a tutor</Link></p>
        </div>

        <div className="relative hidden h-[27rem] lg:block" aria-hidden="true">
          {tickets.map(({ t, m, p, n, i: Icon, r, d, c }) => (
            <div key={t} style={{ "--r": r, "--d": d }} className={`ticket absolute w-[21rem] rounded-2xl bg-white p-5 text-neutral shadow-2xl ${c}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-content"><Icon size={22} /></span>
                <div className="min-w-0">
                  <p className="truncate font-display font-bold">{t}</p>
                  <p className="text-xs text-neutral/60">{m}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral/20 pt-3 text-sm">
                <span className="flex items-center gap-1 font-medium">{n} <BadgeCheck size={15} className="text-info" /></span>
                <span className="font-display text-lg font-bold">{p}<span className="text-xs font-normal text-neutral/60">/mo</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { i: UserPlus, t: "Create your account", d: "Sign up as a student or a tutor. It takes less than a minute and starts on the free plan." },
  { i: FilePlus2, t: "Post or search", d: "Tutors publish batches with fees and schedules. Students search by subject, level and mode." },
  { i: Send, t: "Apply and respond", d: "Students apply with a preferred schedule. Tutors review applicants and accept or reject." },
  { i: GraduationCap, t: "Start learning", d: "Accepted students begin classes and can rate the tuition afterwards." },
];
export function HowItWorks() {
  return (
    <section className="section">
      <div className="container-x">
        <h2 className="section-title">How MentorLagbe works</h2>
        <p className="section-sub">One simple flow for students and tutors, with admin moderation keeping every listing trustworthy.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <li key={s.t} className="relative h-full rounded-box border border-base-300 bg-base-100 p-6">
              <span className="absolute -top-4 left-6 grid h-8 w-8 place-items-center rounded-full bg-accent font-display font-bold text-accent-content">{idx + 1}</span>
              <span className="mt-2 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><s.i size={24} /></span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm opacity-70">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const icons = { Mathematics: Calculator, Physics: Atom, Programming: Code2, IELTS: Languages, Chemistry: FlaskConical, Biology: Dna, English: BookOpen, ICT: Laptop, Accounting: Landmark, Bangla: PenLine };
export function Subjects({ subjects = [] }) {
  const list = subjects.length ? subjects.slice(0, 8) : ["Mathematics", "Physics", "Programming", "IELTS"].map((s) => ({ subject: s, count: 0 }));
  return (
    <section className="section bg-base-200">
      <div className="container-x">
        <h2 className="section-title">Top subjects</h2>
        <p className="section-sub">Jump straight into the subjects students search for the most.</p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map(({ subject, count }) => {
            const Icon = icons[subject] || BookOpen;
            return (
              <Link key={subject} href={`/tuitions?subject=${encodeURIComponent(subject)}`} className="group flex h-full items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content"><Icon size={24} /></span>
                <span>
                  <span className="block font-display font-bold">{subject}</span>
                  <span className="text-sm opacity-60">{count} {count === 1 ? "batch" : "batches"}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / 1200, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

export function PlatformStats({ stats }) {
  const items = [
    { i: BadgeCheck, l: "Tutors", v: stats?.tutors || 0 },
    { i: Users, l: "Students", v: stats?.students || 0 },
    { i: Library, l: "Live tuitions", v: stats?.tuitions || 0 },
    { i: ClipboardCheck, l: "Applications sent", v: stats?.applications || 0 },
  ];
  return (
    <section className="bg-primary text-primary-content">
      <div className="container-x grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {items.map(({ i: Icon, l, v }) => (
          <div key={l} className="text-center">
            <Icon className="mx-auto opacity-80" size={26} />
            <p className="mt-2 font-display text-4xl font-extrabold"><CountUp to={v} />+</p>
            <p className="text-sm opacity-80">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const reviews = [
  { n: "Sadia Rahman", r: "HSC student", t: "I compared three math batches in ten minutes and applied to the best one. My application was accepted the same week." },
  { n: "Rafiq Ahmed", r: "Math & Physics tutor", t: "Posting a batch and managing applicants from one dashboard saves me hours. The verified badge brought more serious students." },
  { n: "Tasnia Akter", r: "BBA student", t: "Filtering by online mode and budget made finding an IELTS tutor easy. Tracking the status of my applications is a big relief." },
];
export function Testimonials() {
  return (
    <section className="section">
      <div className="container-x">
        <h2 className="section-title">What students and tutors say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.n} className="flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6">
              <Quote className="text-accent" size={28} />
              <blockquote className="mt-3 flex-1 opacity-80">{r.t}</blockquote>
              <Stars value={5} size={16} />
              <figcaption className="mt-3"><span className="font-display font-bold">{r.n}</span><span className="text-sm opacity-60"> · {r.r}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
