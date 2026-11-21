"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState, GridSkeleton, Pagination } from "@/components/ui";
import { useSession } from "@/lib/auth-client";
import { api, useFetch } from "@/lib/api";
import { SUBJECTS, CLASS_LEVELS, MODES } from "@/lib/constants";

function Browse() {
  const sp = useSearchParams();
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const [f, setF] = useState({ search: sp.get("search") || "", subject: sp.get("subject") || "", classLevel: "", mode: "" });
  const [debounced, setDebounced] = useState(f.search);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(f.search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [f.search]);

  const qs = new URLSearchParams();
  if (debounced.trim()) qs.set("search", debounced.trim());
  ["subject", "classLevel", "mode"].forEach((k) => f[k] && qs.set(k, f[k]));
  qs.set("page", page);
  qs.set("limit", 9);

  const { data, loading, error } = useFetch(`/tuitions?${qs}`, { auth: false });
  const saved = useFetch("/users/bookmarks/ids", { enabled: isStudent });

  const setFilter = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setPage(1); };
  const clear = () => { setF({ search: "", subject: "", classLevel: "", mode: "" }); setPage(1); };
  const hasFilter = f.search || f.subject || f.classLevel || f.mode;

  const toggleSave = async (id) => {
    try {
      const r = await api(`/users/bookmarks/${id}`, { method: "POST" });
      const ids = saved.data || [];
      saved.setData(r.saved ? [...ids, id] : ids.filter((x) => x !== id));
      toast.success(r.saved ? "Saved to your list" : "Removed from saved");
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="container-x py-12">
      <h1 className="section-title">Browse tuitions</h1>
      <p className="section-sub">Search approved batches and 1-on-1 mentorships, then filter by subject, class level and mode.</p>

      <div className="mt-8 grid gap-3 rounded-box border border-base-300 bg-base-200 p-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <label className="input input-bordered flex items-center gap-2 bg-base-100">
          <Search size={16} className="opacity-50" />
          <input className="grow" placeholder="Search by title or subject" value={f.search} onChange={setFilter("search")} />
        </label>
        <select className="select-base" value={f.subject} onChange={setFilter("subject")} aria-label="Subject">
          <option value="">All subjects</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="select-base" value={f.classLevel} onChange={setFilter("classLevel")} aria-label="Class level">
          <option value="">All class levels</option>{CLASS_LEVELS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="select-base" value={f.mode} onChange={setFilter("mode")} aria-label="Mode">
          <option value="">Online and offline</option>{MODES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={clear} disabled={!hasFilter} className="btn btn-ghost"><X size={16} /> Clear</button>
      </div>

      <div className="mt-8">
        {loading ? (
          <GridSkeleton n={9} />
        ) : error ? (
          <EmptyState title="Couldn't load tuitions" text={error} action={<button className="btn btn-primary btn-sm" onClick={() => location.reload()}>Try again</button>} />
        ) : data?.data?.length ? (
          <>
            <p className="mb-4 text-sm opacity-70">Showing {data.data.length} of {data.total} tuitions</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((t) => (
                <TuitionCard key={t._id} t={t} saved={(saved.data || []).includes(t._id)} onToggleSave={isStudent ? toggleSave : undefined} />
              ))}
            </div>
            <Pagination page={data.page} pages={data.pages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </>
        ) : (
          <EmptyState title="No tuitions match your search" text="Try a different keyword or clear the filters." action={<button onClick={clear} className="btn btn-primary btn-sm">Clear filters</button>} />
        )}
      </div>
    </div>
  );
}

export default function TuitionsPage() {
  return <Suspense fallback={<div className="container-x py-12"><GridSkeleton n={6} /></div>}><Browse /></Suspense>;
}
