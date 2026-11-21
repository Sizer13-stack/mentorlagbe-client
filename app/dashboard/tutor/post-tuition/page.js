"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TuitionForm from "@/components/TuitionForm";
import { Spinner } from "@/components/ui";
import { api, useFetch } from "@/lib/api";

export default function PostTuition() {
  const router = useRouter();
  const { data: stats, loading } = useFetch("/stats/tutor");
  const [busy, setBusy] = useState(false);
  const blocked = stats?.limit && stats.totalTuitions >= stats.limit;

  const submit = async (body) => {
    setBusy(true);
    try {
      await api("/tuitions", { method: "POST", body });
      toast.success("Tuition submitted. It will go live after admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div><h1 className="dash-title">Post a tuition</h1><p className="mt-1 opacity-70">New posts are reviewed by an admin before they appear on the Browse page.</p></div>
      {loading ? <Spinner /> : blocked ? (
        <div role="alert" className="alert alert-warning">
          <span>You have used all {stats.limit} free tuition posts. Upgrade to Pro for unlimited posts.</span>
          <Link href="/pricing" className="btn btn-sm btn-accent">Upgrade to Pro</Link>
        </div>
      ) : (
        <div className="rounded-box border border-base-300 bg-base-100 p-6">
          {stats?.limit && <p className="mb-4 text-sm opacity-70">Free plan: {stats.totalTuitions} of {stats.limit} posts used.</p>}
          <TuitionForm onSubmit={submit} submitting={busy} />
        </div>
      )}
    </div>
  );
}
