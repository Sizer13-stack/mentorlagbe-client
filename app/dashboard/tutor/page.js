"use client";
import Link from "next/link";
import { Library, BadgeCheck, Users, Crown } from "lucide-react";
import { StatCard, StatsSkeleton } from "@/components/ui";
import { useFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function TutorOverview() {
  const { data: s } = useSession();
  const { data, loading, error } = useFetch("/stats/tutor");
  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">Hello, {s?.user?.name?.split(" ")[0]}</h1><p className="mt-1 opacity-70">A quick look at your tuitions and applicants.</p></div>
      {loading ? <StatsSkeleton /> : error ? <div className="alert alert-error">{error}</div> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Library} label="Total Tuitions Posted" value={data.totalTuitions} hint={data.limit ? `${data.totalTuitions} of ${data.limit} free posts used` : "Unlimited posts"} />
          <StatCard icon={BadgeCheck} label="Active / Approved Tuitions" value={data.activeApproved} />
          <StatCard icon={Users} label="Total Applicants Received" value={data.totalApplicants} color="secondary" />
          <StatCard icon={Crown} label="Current Plan" value={data.plan} color="accent" hint={data.plan === "pro" ? "Verified badge is on" : "Upgrade for unlimited posts"} />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/tutor/post-tuition" className="btn btn-primary">Post a Tuition</Link>
        <Link href="/dashboard/tutor/applicants" className="btn btn-outline">Review applicants</Link>
        {data?.plan === "free" && <Link href="/pricing" className="btn btn-accent">Upgrade to Pro</Link>}
      </div>
    </div>
  );
}
