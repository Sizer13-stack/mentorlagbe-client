"use client";
import { Users, GraduationCap, ShieldCheck, DollarSign } from "lucide-react";
import { StatCard, StatsSkeleton } from "@/components/ui";
import { useFetch } from "@/lib/api";

export default function AdminOverview() {
  const { data, loading, error } = useFetch("/admin/stats");
  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">Platform overview</h1><p className="mt-1 opacity-70">Live numbers from users, tuitions and Stripe payments.</p></div>
      {loading ? <StatsSkeleton /> : error ? <div className="alert alert-error">{error}</div> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
          <StatCard icon={GraduationCap} label="Total Tutors" value={data.totalTutors} color="info" />
          <StatCard icon={ShieldCheck} label="Pending vs. Approved Tuitions" value={`${data.pendingTuitions} / ${data.approvedTuitions}`} color="secondary" hint={`${data.pendingTuitions} pending, ${data.approvedTuitions} approved`} />
          <StatCard icon={DollarSign} label="Total Stripe Revenue" value={`$${data.totalRevenue}`} color="accent" />
        </div>
      )}
    </div>
  );
}
