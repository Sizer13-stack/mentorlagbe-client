"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { authClient, useSession } from "@/lib/auth-client";

export default function Profile() {
  const { data } = useSession();
  const user = data?.user;
  const [f, setF] = useState({ name: "", phone: "", bio: "", image: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setF({ name: user.name || "", phone: user.phone || "", bio: user.bio || "", image: user.image || "" });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (f.phone && !/^[+0-9][0-9\s-]{7,14}$/.test(f.phone.trim())) return toast.error("Enter a valid phone number");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: f.name.trim(), phone: f.phone.trim(), bio: f.bio.trim(), image: f.image || null });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not update your profile");
    toast.success("Profile updated");
  };

  if (!user) return null;
  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="dash-title">Update profile</h1><p className="mt-1 opacity-70">Keep your details current. Tutors see your name and photo on listings.</p></div>
      <form onSubmit={save} className="grid gap-5 rounded-box border border-base-300 bg-base-100 p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label font-semibold">Profile picture</label>
          <ImageUpload round value={f.image} onChange={(image) => setF({ ...f, image })} label="Upload photo" />
        </div>
        <div>
          <label className="label font-semibold">Full name</label>
          <input className="input-base" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </div>
        <div>
          <label className="label font-semibold">Phone</label>
          <input className="input-base" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="label font-semibold">Email</label>
          <input className="input-base opacity-60" value={user.email} disabled />
        </div>
        <div>
          <label className="label font-semibold">Role</label>
          <input className="input-base capitalize opacity-60" value={`${user.role}${user.role !== "admin" ? ` · ${user.plan || "free"} plan` : ""}`} disabled />
        </div>
        <div className="md:col-span-2">
          <label className="label font-semibold">Bio</label>
          <textarea rows={4} className="textarea textarea-bordered w-full bg-base-100" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="Tell students and tutors a little about yourself" />
        </div>
        <div className="md:col-span-2"><button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Save changes</button></div>
      </form>
    </div>
  );
}
