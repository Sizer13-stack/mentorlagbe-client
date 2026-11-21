"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { EmptyState, Pagination, StatusBadge, TableSkeleton } from "@/components/ui";
import { api, useFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { fmtDate } from "@/lib/constants";

export default function AdminUsers() {
  const { data: s } = useSession();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { const t = setTimeout(() => { setQ(search); setPage(1); }, 400); return () => clearTimeout(t); }, [search]);

  const qs = new URLSearchParams({ page, limit: 10 });
  if (q.trim()) qs.set("search", q.trim());
  if (role) qs.set("role", role);
  const { data, loading, error, reload } = useFetch(`/admin/users?${qs}`);

  const change = async (u, newRole) => {
    try { await api(`/admin/users/${u._id}/role`, { method: "PATCH", body: { role: newRole } }); toast.success(`${u.name} is now ${newRole}`); reload(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="dash-title">User management</h1><p className="mt-1 opacity-70">Search users and manage their roles.</p></div>
      <div className="flex flex-wrap gap-3">
        <label className="input input-bordered flex max-w-sm flex-1 items-center gap-2 bg-base-100"><Search size={16} className="opacity-50" /><input className="grow" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <select className="select select-bordered bg-base-100" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option><option value="student">Students</option><option value="tutor">Tutors</option><option value="admin">Admins</option>
        </select>
      </div>
      {loading ? <TableSkeleton /> : error ? <div className="alert alert-error">{error}</div> : !data.data.length ? <EmptyState title="No users found" /> : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead><tr><th>User</th><th>Plan</th><th>Joined</th><th>Role</th></tr></thead>
              <tbody>
                {data.data.map((u) => (
                  <tr key={u._id}>
                    <td><div className="flex items-center gap-3"><Avatar src={u.image} name={u.name} size={38} /><div><p className="font-semibold">{u.name}</p><p className="text-xs opacity-60">{u.email}</p></div></div></td>
                    <td><StatusBadge status={u.plan || "free"} /></td>
                    <td className="whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                    <td>
                      <select className="select select-bordered select-sm bg-base-100 capitalize" value={u.role} disabled={u.email === s?.user?.email} onChange={(e) => change(u, e.target.value)} aria-label={`Role for ${u.name}`}>
                        <option value="student">student</option><option value="tutor">tutor</option><option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
