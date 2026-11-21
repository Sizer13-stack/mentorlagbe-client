"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, GraduationCap, Heart, Info, MapPin, Monitor, Wallet, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { EmptyState, Modal, Spinner, Stars } from "@/components/ui";
import { useSession } from "@/lib/auth-client";
import { api, useFetch } from "@/lib/api";
import { fmtDate, taka } from "@/lib/constants";

export default function TuitionDetails({ params }) {
  const { id } = params;
  const { data: session } = useSession();
  const user = session?.user;
  const isStudent = user?.role === "student";
  const { data: t, loading, error } = useFetch(`/tuitions/${id}`, { auth: false });
  const mine = useFetch("/applications/mine", { enabled: isStudent });
  const saved = useFetch("/users/bookmarks/ids", { enabled: isStudent });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ studentPhone: "", preferredSchedule: "", studentNote: "" });
  const [errs, setErrs] = useState({});

  if (loading) return <div className="container-x flex min-h-[50vh] items-center justify-center"><Spinner className="loading-lg" /></div>;
  if (error || !t)
    return (
      <div className="container-x py-16">
        <EmptyState title="Tuition not found" text="It may have been closed or removed by the tutor." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse tuitions</Link>} />
      </div>
    );

  const applied = (mine.data || []).some((a) => a.tuitionId === t._id);
  const isSaved = (saved.data || []).includes(t._id);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!/^[+0-9][0-9\s-]{7,14}$/.test(form.studentPhone.trim())) er.studentPhone = "Enter a valid phone number";
    if (!form.preferredSchedule.trim()) er.preferredSchedule = "Preferred schedule is required";
    if (form.studentNote.trim().length < 10) er.studentNote = "Write at least 10 characters";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await api("/applications", { method: "POST", body: { tuitionId: t._id, ...form } });
      toast.success("Application submitted. The tutor will review it soon.");
      setOpen(false);
      mine.reload();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };

  const toggleSave = async () => {
    try {
      const r = await api(`/users/bookmarks/${t._id}`, { method: "POST" });
      const ids = saved.data || [];
      saved.setData(r.saved ? [...ids, t._id] : ids.filter((x) => x !== t._id));
      toast.success(r.saved ? "Saved to your list" : "Removed from saved");
    } catch (e) { toast.error(e.message); }
  };

  const facts = [
    { i: BookOpen, l: "Subject", v: t.subject },
    { i: GraduationCap, l: "Class level", v: t.classLevel },
    { i: CalendarDays, l: "Schedule", v: `${t.daysPerWeek} days per week` },
    { i: Monitor, l: "Mode", v: t.mode },
    { i: MapPin, l: "Location", v: t.location },
    { i: Wallet, l: "Monthly fee", v: taka(t.monthlyFee) },
  ];

  return (
    <div className="container-x py-10">
      <Link href="/tuitions" className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to tuitions</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="aspect-[16/8] overflow-hidden rounded-box bg-base-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.bannerImage} alt={t.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="badge badge-primary">{t.subject}</span>
            <span className={`badge ${t.mode === "Online" ? "badge-info" : "badge-secondary"}`}>{t.mode}</span>
            {t.ratingCount > 0 && <span className="inline-flex items-center gap-1 text-sm"><Stars value={t.ratingAvg} size={14} /> {t.ratingAvg} ({t.ratingCount})</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(({ i: Icon, l, v }) => (
              <div key={l} className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon size={18} /></span>
                <div className="min-w-0"><dt className="text-xs opacity-60">{l}</dt><dd className="truncate font-semibold">{v}</dd></div>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 font-display text-2xl font-bold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed opacity-80">{t.description}</p>

          <h2 className="mt-10 font-display text-2xl font-bold">Student reviews</h2>
          {t.reviews?.length ? (
            <div className="mt-4 space-y-4">
              {t.reviews.map((r, i) => (
                <div key={i} className="rounded-box border border-base-300 p-4">
                  <div className="flex items-center gap-3"><Avatar src={r.studentImage} name={r.studentName} size={36} /><div><p className="font-semibold">{r.studentName}</p><Stars value={r.rating} size={14} /></div></div>
                  <p className="mt-3 text-sm opacity-80">{r.feedback}</p>
                </div>
              ))}
            </div>
          ) : <p className="mt-3 text-sm opacity-60">No reviews yet. Students can review after their application is accepted.</p>}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-box border border-base-300 bg-base-100 p-6">
            <p><span className="font-display text-4xl font-extrabold">{taka(t.monthlyFee)}</span><span className="opacity-60"> /month</span></p>
            <div className="mt-5 space-y-3">
              {!user ? (
                <Link href={`/sign-in?redirect=/tuitions/${t._id}`} className="btn btn-primary w-full">Sign in to apply</Link>
              ) : isStudent ? (
                <>
                  <button disabled={applied} onClick={() => setOpen(true)} className="btn btn-primary w-full">{applied ? "Already applied" : "Apply for Tuition"}</button>
                  <button onClick={toggleSave} className="btn btn-outline w-full"><Heart size={16} className={isSaved ? "fill-error text-error" : ""} /> {isSaved ? "Saved" : "Save for later"}</button>
                </>
              ) : (
                <>
                  <button disabled className="btn btn-disabled w-full">Apply for Tuition</button>
                  <div role="alert" className="alert alert-info py-2 text-sm"><Info size={16} /><span>Only students can apply for tuitions. You are signed in as {user.role}.</span></div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-6">
            <h3 className="font-display text-lg font-bold">Your tutor</h3>
            <div className="mt-4 flex items-center gap-3">
              <Avatar src={t.tutor?.image} name={t.tutorName} size={52} />
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-semibold">{t.tutorName} {t.tutorVerified && <BadgeCheck size={16} className="text-info" />}</p>
                <p className="truncate text-sm opacity-60">{t.tutorEmail}</p>
              </div>
            </div>
            {t.tutor?.bio && <p className="mt-4 text-sm opacity-80">{t.tutor.bio}</p>}
            {t.tutor?.createdAt && <p className="mt-3 text-xs opacity-60">Member since {fmtDate(t.tutor.createdAt)}</p>}
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Apply for this tuition">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="label font-semibold">Phone number</label>
            <input className="input-base" value={form.studentPhone} onChange={(e) => setForm({ ...form, studentPhone: e.target.value })} placeholder="01XXXXXXXXX" />
            {errs.studentPhone && <p className="mt-1 text-xs text-error">{errs.studentPhone}</p>}
          </div>
          <div>
            <label className="label font-semibold">Preferred schedule</label>
            <input className="input-base" value={form.preferredSchedule} onChange={(e) => setForm({ ...form, preferredSchedule: e.target.value })} placeholder="e.g. Sat, Mon, Wed at 8 PM" />
            {errs.preferredSchedule && <p className="mt-1 text-xs text-error">{errs.preferredSchedule}</p>}
          </div>
          <div>
            <label className="label font-semibold">Learning note</label>
            <textarea rows={4} className="textarea textarea-bordered w-full bg-base-100" value={form.studentNote} onChange={(e) => setForm({ ...form, studentNote: e.target.value })} placeholder="What do you want to improve?" />
            {errs.studentNote && <p className="mt-1 text-xs text-error">{errs.studentNote}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Submit application</button>
        </form>
      </Modal>
    </div>
  );
}
