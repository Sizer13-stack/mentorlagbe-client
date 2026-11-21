"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

const demos = [
  { l: "Admin", e: "admin@mentorlagbe.com", p: "Admin@12345" },
  { l: "Tutor", e: "rafiq@mentorlagbe.com", p: "Tutor@12345" },
  { l: "Student", e: "sadia@mentorlagbe.com", p: "Student@12345" },
];

function Form() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/dashboard";
  const { data: session } = useSession();
  const [f, setF] = useState({ email: "", password: "" });
  const [errs, setErrs] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (session?.user) router.replace(redirect); }, [session, router, redirect]);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address";
    if (!f.password) er.password = "Password is required";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const { error } = await signIn.email({ email: f.email, password: f.password });
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    clearToken();
    toast.success("Signed in successfully");
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm opacity-70">New here? <Link href="/sign-up" className="font-semibold text-primary">Create an account</Link></p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="label font-semibold">Email</label>
            <input type="email" className="input-base" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
            {errs.email && <p className="mt-1 text-xs text-error">{errs.email}</p>}
          </div>
          <div>
            <label className="label font-semibold">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} className="input-base pr-11" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="Your password" autoComplete="current-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" aria-label="Toggle password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errs.password && <p className="mt-1 text-xs text-error">{errs.password}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Sign In</button>
        </form>
        <div className="mt-6 border-t border-base-300 pt-4">
          <p className="text-xs opacity-60">Quick test logins (fill the form):</p>
          <div className="mt-2 flex gap-2">
            {demos.map((d) => <button key={d.l} type="button" onClick={() => setF({ email: d.e, password: d.p })} className="btn btn-outline btn-xs">{d.l}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return <Suspense><Form /></Suspense>;
}
