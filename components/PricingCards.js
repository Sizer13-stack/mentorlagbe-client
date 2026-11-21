"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

const PLANS = [
  { id: "tutor-free", role: "tutor", pro: false, name: "Free Tutor", price: 0, features: ["Post up to 2 tuitions", "Manage student applicants", "Listed publicly after admin approval"] },
  { id: "tutor-pro", role: "tutor", pro: true, name: "Pro Tutor", price: 15, features: ["Unlimited tuition posts", "Verified tutor badge on every listing", "Everything in Free Tutor"] },
  { id: "student-free", role: "student", pro: false, name: "Free Student", price: 0, features: ["Browse and filter all tuitions", "Apply and track application status", "Save favourite tuitions"] },
  { id: "student-pro", role: "student", pro: true, name: "Pro Student", price: 10, features: ["Priority booking: tutors see your application first", "Everything in Free Student"] },
];

export default function PricingCards() {
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  const subscribe = async (p) => {
    if (!user) return router.push("/sign-in?redirect=/pricing");
    if (user.role !== p.role) return toast.error(`The ${p.name} plan is only for ${p.role}s`);
    setLoading(p.id);
    try {
      const { url } = await api("/payments/create-checkout-session", { method: "POST" });
      window.location.href = url;
    } catch (e) {
      toast.error(e.message);
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((p) => {
        const current = user?.role === p.role && (user?.plan || "free") === (p.pro ? "pro" : "free");
        return (
          <div key={p.id} className={`flex h-full flex-col rounded-box border bg-base-100 p-6 ${p.pro ? "border-primary ring-2 ring-primary/30" : "border-base-300"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              {p.pro && <span className="badge badge-accent gap-1"><Crown size={12} /> Pro</span>}
            </div>
            <p className="mt-1 text-sm opacity-60">For {p.role}s</p>
            <p className="mt-5"><span className="font-display text-4xl font-extrabold">${p.price}</span><span className="text-sm opacity-60">{p.price ? " one-time" : " forever"}</span></p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> {f}</li>
              ))}
            </ul>
            <div className="mt-6">
              {current ? (
                <button disabled className="btn btn-disabled w-full">Current plan</button>
              ) : p.pro ? (
                <button onClick={() => subscribe(p)} disabled={loading === p.id} className="btn btn-primary w-full">
                  {loading === p.id && <span className="loading loading-spinner loading-sm" />} Subscribe with Stripe
                </button>
              ) : (
                <Link href={user ? "/dashboard" : "/sign-up"} className="btn btn-outline w-full">{user ? "Go to dashboard" : "Get started free"}</Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
