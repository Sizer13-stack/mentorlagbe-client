import PricingCards from "@/components/PricingCards";

export const metadata = { title: "Pricing | MentorLagbe" };

const faqs = [
  { q: "What does the Pro Tutor plan unlock?", a: "Unlimited tuition posts (Free tutors can post up to 2) and a verified badge on every listing." },
  { q: "What is priority booking for students?", a: "Pro students' applications appear first in the tutor's applicant list, marked as priority." },
  { q: "How do I pay?", a: "Payments are handled by Stripe Checkout. Your plan upgrades automatically as soon as the payment succeeds." },
];

export default function Pricing() {
  return (
    <div className="container-x py-14">
      <h1 className="section-title">Pricing and Pro plans</h1>
      <p className="section-sub">Free plans cover the basics. Upgrade once with Stripe to unlock more for tutors or priority booking for students.</p>
      <div className="mt-10"><PricingCards /></div>
      <h2 className="mt-16 font-display text-2xl font-bold">Common questions</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <div key={f.q} className="collapse collapse-arrow rounded-box border border-base-300 bg-base-100">
            <input type="checkbox" aria-label={f.q} />
            <div className="collapse-title font-semibold">{f.q}</div>
            <div className="collapse-content text-sm opacity-80"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
