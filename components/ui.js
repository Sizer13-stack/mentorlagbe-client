"use client";
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react";

export function Stars({ value = 0, size = 16, onChange }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${n} star`}
        >
          <Star size={size} className={n <= Math.round(value) ? "fill-accent text-accent" : "text-base-300"} />
        </button>
      ))}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal modal-open z-50" role="dialog">
      <div className={`modal-box ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh]`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm" aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText = "Confirm", danger, loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="opacity-80">{message}</p>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? "btn-error" : "btn-primary"}`} onClick={onConfirm} disabled={loading}>
          {loading && <span className="loading loading-spinner loading-xs" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <div className="join mt-10 flex justify-center">
      <button className="btn join-item btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} /> Previous</button>
      {nums.map((n, i) =>
        n === "…" ? (
          <button key={`e${i}`} className="btn join-item btn-sm btn-disabled">…</button>
        ) : (
          <button key={n} onClick={() => onChange(n)} className={`btn join-item btn-sm ${n === page ? "btn-primary" : ""}`}>{n}</button>
        )
      )}
      <button className="btn join-item btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next <ChevronRight size={16} /></button>
    </div>
  );
}

const tone = {
  pending: "badge-warning", approved: "badge-success", accepted: "badge-success",
  rejected: "badge-error", active: "badge-success", closed: "badge-neutral", pro: "badge-accent", free: "badge-ghost",
};
export function StatusBadge({ status }) {
  return <span className={`badge ${tone[status] || "badge-ghost"} capitalize`}>{status}</span>;
}

export function StatCard({ icon: Icon, label, value, hint, color = "primary" }) {
  const colors = { primary: "bg-primary/10 text-primary", accent: "bg-accent/20 text-accent", secondary: "bg-secondary/10 text-secondary", info: "bg-info/10 text-info" };
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold opacity-70">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${colors[color]}`}><Icon size={20} /></span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold capitalize">{value}</p>
      {hint && <p className="mt-1 text-xs opacity-60">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {text && <p className="mx-auto mt-2 max-w-md text-sm opacity-70">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="aspect-[16/9] animate-pulse bg-base-300" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-base-300" />
        <div className="h-5 w-full animate-pulse rounded bg-base-300" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-base-300" />
        <div className="h-9 w-full animate-pulse rounded bg-base-300" />
      </div>
    </div>
  );
}
export function GridSkeleton({ n = 6 }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: n }).map((_, i) => <CardSkeleton key={i} />)}</div>;
}
export function StatsSkeleton({ n = 4 }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: n }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-box bg-base-300" />)}</div>;
}
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 rounded-box border border-base-300 bg-base-100 p-4">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded bg-base-300" />)}
    </div>
  );
}
export const Spinner = ({ className = "" }) => <span className={`loading loading-spinner text-primary ${className}`} />;
