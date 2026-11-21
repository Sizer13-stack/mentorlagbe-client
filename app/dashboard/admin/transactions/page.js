"use client";
import { EmptyState, TableSkeleton } from "@/components/ui";
import { useFetch } from "@/lib/api";
import { fmtDate } from "@/lib/constants";

export default function Transactions() {
  const { data, loading, error } = useFetch("/admin/transactions");
  const total = (data || []).reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="dash-title">Transactions</h1><p className="mt-1 opacity-70">All Pro subscription payments recorded from Stripe.</p></div>
        {data && <p className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-sm">Total revenue: <span className="font-display text-lg font-bold">${total}</span></p>}
      </div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.length ? <EmptyState title="No payments yet" text="Pro plan purchases will show up here." /> : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Transaction ID</th><th>Date</th></tr></thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id}>
                  <td><p className="font-semibold">{p.userName}</p><p className="text-xs opacity-60">{p.userEmail}</p></td>
                  <td className="capitalize">{p.userRole}</td>
                  <td>{p.planName}</td>
                  <td className="font-semibold">${p.amount} <span className="text-xs uppercase opacity-60">{p.currency}</span></td>
                  <td className="max-w-[14rem] truncate font-mono text-xs" title={p.transactionId}>{p.transactionId}</td>
                  <td className="whitespace-nowrap">{fmtDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
