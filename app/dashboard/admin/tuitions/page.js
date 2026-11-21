"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { EmptyState, StatusBadge, TableSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";
import { fmtDate, taka } from "@/lib/constants";

const tabs = ["all", "pending", "approved", "rejected"];

export default function AdminTuitions() {
  const [tab, setTab] = useState("pending");
  const { data, loading, error, reload } = useFetch(`/admin/tuitions${tab === "all" ? "" : `?status=${tab}`}`);
  const [busyId, setBusyId] = useState(null);

  const setStatus = async (t, status) => {
    setBusyId(t._id);
    try { await api(`/admin/tuitions/${t._id}/status`, { method: "PATCH", body: { status } }); toast.success(`Tuition ${status}`); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">Tuition approval</h1><p className="mt-1 opacity-70">Only approved and active tuitions appear on the public Browse page.</p></div>
      <div role="tablist" className="tabs tabs-boxed w-fit bg-base-100">
        {tabs.map((t) => <button key={t} role="tab" onClick={() => setTab(t)} className={`tab capitalize ${tab === t ? "tab-active" : ""}`}>{t}</button>)}
      </div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? <EmptyState title={`No ${tab === "all" ? "" : tab} tuitions`} /> : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Tutor</th><th>Fee</th><th>Posted</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
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
                  <td><p className="font-medium">{t.tutorName}</p><p className="text-xs opacity-60">{t.tutorEmail}</p></td>
                  <td>{taka(t.monthlyFee)}</td>
                  <td className="whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                  <td><StatusBadge status={t.approvalStatus} /></td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button disabled={busyId === t._id || t.approvalStatus === "approved"} onClick={() => setStatus(t, "approved")} className="btn btn-success btn-sm text-white"><Check size={14} /> Approve</button>
                      <button disabled={busyId === t._id || t.approvalStatus === "rejected"} onClick={() => setStatus(t, "rejected")} className="btn btn-error btn-outline btn-sm"><X size={14} /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
