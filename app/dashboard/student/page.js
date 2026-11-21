"use client";
import Link from "next/link";
import { ClipboardList, CheckCircle2, Clock, Crown, Heart } from "lucide-react";
import { StatCard, StatsSkeleton } from "@/components/ui";
import { useFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function StudentOverview() {
  const { data: s } = useSession();
  const { data, loading, error } = useFetch("/stats/student");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="dash-title">Hello, {s?.user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 opacity-70">Here is where your tuition applications stand.</p>
      </div>
      {loading ? <StatsSkeleton /> : error ? <div className="alert alert-error">{error}</div> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ClipboardList} label="Total Applied Tuitions" value={data.totalApplied} />
          <StatCard icon={CheckCircle2} label="Accepted Applications" value={data.accepted} color="primary" />
          <StatCard icon={Clock} label="Pending Applications" value={data.pending} color="secondary" />
          <StatCard icon={Crown} label="Current Plan" value={data.plan} color="accent" hint={data.plan === "pro" ? "Priority booking is on" : "Upgrade for priority booking"} />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-box border border-base-300 bg-base-100 p-6">
          <h3 className="font-display text-lg font-bold">Find your next tuition</h3>
          <p className="mt-1 text-sm opacity-70">Search approved batches by subject, class level and mode.</p>
          <Link href="/tuitions" className="btn btn-primary btn-sm mt-4">Browse Tuitions</Link>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Heart size={18} /> Saved tuitions{data ? ` (${data.saved})` : ""}</h3>
          <p className="mt-1 text-sm opacity-70">Keep a shortlist of batches you like and apply later.</p>
          <Link href="/dashboard/student/saved" className="btn btn-outline btn-sm mt-4">Open saved list</Link>
        </div>
      </div>
    </div>
  );
}
