"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import TuitionForm from "@/components/TuitionForm";
import { ConfirmModal, EmptyState, Modal, StatusBadge, TableSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";
import { fmtDate, taka } from "@/lib/constants";

export default function MyTuitions() {
  const { data, loading, error, reload } = useFetch("/tuitions/mine/list");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const update = async (body) => {
    setBusy(true);
    try { await api(`/tuitions/${edit._id}`, { method: "PUT", body }); toast.success("Tuition updated and sent for re-approval"); setEdit(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const remove = async () => {
    setBusy(true);
    try { await api(`/tuitions/${del._id}`, { method: "DELETE" }); toast.success("Tuition deleted"); setDel(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const toggle = async (t) => {
    try { const r = await api(`/tuitions/${t._id}/toggle`, { method: "PATCH" }); toast.success(r.isActive ? "Tuition is active again" : "Tuition closed"); reload(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="dash-title">My tuitions</h1><p className="mt-1 opacity-70">Edit, close or delete your posts. Edited posts return to admin review.</p></div>
        <Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm">Post a Tuition</Link>
      </div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? (
        <EmptyState title="You haven't posted a tuition yet" action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm">Post your first tuition</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Fee</th><th>Approval</th><th>Status</th><th>Posted</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id}>
                  <td className="min-w-[16rem]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.bannerImage} alt="" className="h-12 w-20 rounded-lg object-cover" />
                      <div><p className="font-semibold">{t.title}</p><p className="text-xs opacity-60">{t.subject} · {t.classLevel} · {t.mode}</p></div>
                    </div>
                  </td>
                  <td>{taka(t.monthlyFee)}</td>
                  <td><StatusBadge status={t.approvalStatus} /></td>
                  <td><StatusBadge status={t.isActive ? "active" : "closed"} /></td>
                  <td className="whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => toggle(t)} className="btn btn-ghost btn-sm" title={t.isActive ? "Close" : "Reopen"}><Power size={16} /> {t.isActive ? "Close" : "Reopen"}</button>
                      <button onClick={() => setEdit(t)} className="btn btn-ghost btn-sm" title="Edit"><Pencil size={16} /> Edit</button>
                      <button onClick={() => setDel(t)} className="btn btn-ghost btn-sm text-error" title="Delete"><Trash2 size={16} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit tuition" wide>
        {edit && <TuitionForm initial={edit} onSubmit={update} submitting={busy} submitLabel="Save changes" />}
      </Modal>
      <ConfirmModal open={!!del} danger title="Delete this tuition?" message={`"${del?.title}" and its applications will be permanently removed.`} confirmText="Delete" loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </div>
  );
}
