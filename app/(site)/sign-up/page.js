"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Presentation } from "lucide-react";
import { toast } from "sonner";
import { signUp, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export default function SignUp() {
  const router = useRouter();
  const { data: session } = useSession();
  const [f, setF] = useState({ name: "", email: "", password: "", role: "student" });
  const [errs, setErrs] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (session?.user) router.replace("/dashboard"); }, [session, router]);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address";
    if (f.password.length < 6) er.password = "Password must be at least 6 characters";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const { error } = await signUp.email({ name: f.name.trim(), email: f.email, password: f.password, role: f.role });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    clearToken();
    toast.success("Account created. Welcome to MentorLagbe!");
    router.push("/dashboard");
    router.refresh();
  };

  const roles = [
    { v: "student", t: "Student", d: "Find and apply to tuitions", i: GraduationCap },
    { v: "tutor", t: "Tutor", d: "Post batches and get students", i: Presentation },
  ];

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm opacity-70">Already registered? <Link href="/sign-in" className="font-semibold text-primary">Sign in</Link></p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="label font-semibold">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button key={r.v} type="button" onClick={() => setF({ ...f, role: r.v })} className={`rounded-box border p-3 text-left transition-colors ${f.role === r.v ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/50"}`}>
                  <r.i size={20} className="text-primary" />
                  <p className="mt-1 font-semibold">{r.t}</p>
                  <p className="text-xs opacity-60">{r.d}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label font-semibold">Full name</label>
            <input className="input-base" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your full name" autoComplete="name" />
            {errs.name && <p className="mt-1 text-xs text-error">{errs.name}</p>}
          </div>
          <div>
            <label className="label font-semibold">Email</label>
            <input type="email" className="input-base" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
            {errs.email && <p className="mt-1 text-xs text-error">{errs.email}</p>}
          </div>
          <div>
            <label className="label font-semibold">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} className="input-base pr-11" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="At least 6 characters" autoComplete="new-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" aria-label="Toggle password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errs.password && <p className="mt-1 text-xs text-error">{errs.password}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Sign Up</button>
        </form>
      </div>
    </div>
  );
}
