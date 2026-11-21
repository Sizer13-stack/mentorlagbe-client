"use client";
import { useState } from "react";
import { Check, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, StatusBadge, TableSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";
import { fmtDate } from "@/lib/constants";

export default function Applicants() {
  const { data, loading, error, reload } = useFetch("/applications/tutor");
  const [busyId, setBusyId] = useState(null);

  const setStatus = async (a, status) => {
    setBusyId(a._id);
    try { await api(`/applications/${a._id}/status`, { method: "PATCH", body: { status } }); toast.success(`Application ${status}`); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">Applicants</h1><p className="mt-1 opacity-70">Students who applied to your tuitions. Priority students (Pro) are listed first.</p></div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? (
        <EmptyState title="No applicants yet" text="When students apply to your approved tuitions, they appear here." />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>Student</th><th>Phone</th><th>Tuition</th><th>Schedule</th><th>Note</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id}>
                  <td className="min-w-[12rem]"><p className="flex items-center gap-1 font-semibold">{a.studentName} {a.isPriority && <span title="Priority booking (Pro student)" className="text-accent"><Zap size={14} /></span>}</p><p className="text-xs opacity-60">{a.studentEmail}</p></td>
                  <td className="whitespace-nowrap">{a.studentPhone}</td>
                  <td className="min-w-[12rem]">{a.tuitionTitle}<p className="text-xs opacity-60">Applied {fmtDate(a.appliedAt)}</p></td>
                  <td className="min-w-[9rem]">{a.preferredSchedule}</td>
                  <td className="max-w-[16rem]"><p className="line-clamp-2 text-sm" title={a.studentNote}>{a.studentNote}</p></td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button disabled={busyId === a._id || a.status === "accepted"} onClick={() => setStatus(a, "accepted")} className="btn btn-success btn-sm text-white"><Check size={14} /> Accept</button>
                      <button disabled={busyId === a._id || a.status === "rejected"} onClick={() => setStatus(a, "rejected")} className="btn btn-error btn-outline btn-sm"><X size={14} /> Reject</button>
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
