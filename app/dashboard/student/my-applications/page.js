"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal, EmptyState, Modal, Stars, StatusBadge, TableSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";
import { fmtDate, taka } from "@/lib/constants";

export default function MyApplications() {
  const { data, loading, error, reload } = useFetch("/applications/mine");
  const [del, setDel] = useState(null);
  const [rev, setRev] = useState(null);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState({ rating: 5, feedback: "" });

  const cancel = async () => {
    setBusy(true);
    try { await api(`/applications/${del._id}`, { method: "DELETE" }); toast.success("Application cancelled"); setDel(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const submitReview = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await api(`/tuitions/${rev.tuitionId}/reviews`, { method: "POST", body: review }); toast.success("Thanks for your review!"); setRev(null); reload(); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">My applications</h1><p className="mt-1 opacity-70">Track every tuition you applied to. Pending applications can be cancelled.</p></div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? (
        <EmptyState title="No applications yet" text="Apply to a tuition and it will show up here." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse Tuitions</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Tutor</th><th>Monthly fee</th><th>Applied</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id}>
                  <td className="min-w-[14rem]"><Link href={`/tuitions/${a.tuitionId}`} className="font-semibold hover:text-primary">{a.tuitionTitle}</Link><p className="text-xs opacity-60">{a.subject}</p></td>
                  <td><p className="font-medium">{a.tutorName}</p><p className="text-xs opacity-60">{a.tutorEmail}</p></td>
                  <td>{taka(a.monthlyFee)}</td>
                  <td className="whitespace-nowrap">{fmtDate(a.appliedAt)}</td>
                  <td><div className="flex items-center gap-1"><StatusBadge status={a.status} />{a.isPriority && <span title="Priority booking" className="text-accent"><Zap size={16} /></span>}</div></td>
                  <td className="text-right">
                    {a.status === "pending" && <button onClick={() => setDel(a)} className="btn btn-ghost btn-sm text-error"><Trash2 size={16} /> Cancel</button>}
                    {a.status === "accepted" && (a.hasReviewed
                      ? <span className="text-sm opacity-60">Reviewed</span>
                      : <button onClick={() => { setReview({ rating: 5, feedback: "" }); setRev(a); }} className="btn btn-outline btn-sm"><Star size={16} /> Rate</button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!del} danger title="Cancel this application?" message={`Your application for "${del?.tuitionTitle}" will be deleted.`} confirmText="Cancel application" loading={busy} onConfirm={cancel} onClose={() => setDel(null)} />
      <Modal open={!!rev} onClose={() => setRev(null)} title="Rate this tuition">
        <form onSubmit={submitReview} className="space-y-4">
          <p className="text-sm opacity-70">{rev?.tuitionTitle}</p>
          <Stars value={review.rating} size={30} onChange={(rating) => setReview({ ...review, rating })} />
          <textarea required minLength={5} rows={4} className="textarea textarea-bordered w-full bg-base-100" placeholder="Share your experience" value={review.feedback} onChange={(e) => setReview({ ...review, feedback: e.target.value })} />
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Submit review</button>
        </form>
      </Modal>
    </div>
  );
}
