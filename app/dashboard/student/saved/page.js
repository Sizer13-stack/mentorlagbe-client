"use client";
import Link from "next/link";
import { toast } from "sonner";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState, GridSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";

export default function Saved() {
  const { data, loading, error, setData } = useFetch("/users/bookmarks");
  const remove = async (id) => {
    try { await api(`/users/bookmarks/${id}`, { method: "POST" }); setData(data.filter((t) => t._id !== id)); toast.success("Removed from saved"); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">Saved tuitions</h1><p className="mt-1 opacity-70">Your shortlist. Tap the heart to remove an item.</p></div>
      {loading ? <GridSkeleton n={3} /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? (
        <EmptyState title="Nothing saved yet" text="Save tuitions from the browse page and they will appear here." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse Tuitions</Link>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{data.map((t) => <TuitionCard key={t._id} t={t} saved onToggleSave={remove} />)}</div>
      )}
    </div>
  );
}
