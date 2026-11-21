"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard, ClipboardList, Heart, FilePlus2, Library, Users, ShieldCheck, Receipt, UserCog,
  PanelLeftClose, PanelLeftOpen, Menu, LogOut, Home, Crown, X,
} from "lucide-react";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession, signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

const NAV = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/student/saved", label: "Saved Tuitions", icon: Heart },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: FilePlus2 },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: Library },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
};

export default function DashboardLayout({ children }) {
  const { data, isPending } = useSession();
  const user = data?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  // session resolved but nobody is logged in
  useEffect(() => {
    if (!isPending && !user) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, user, pathname, router]);

  // dynamic role-based routing
  useEffect(() => {
    if (!user) return;
    const base = `/dashboard/${user.role}`;
    if (pathname === "/dashboard") router.replace(base);
    else if (/^\/dashboard\/(student|tutor|admin)(\/|$)/.test(pathname) && !pathname.startsWith(base)) router.replace(base);
  }, [user, pathname, router]);

  useEffect(() => setMobile(false), [pathname]);

  if (isPending || !user)
    return <div className="grid min-h-screen place-items-center"><span className="loading loading-spinner loading-lg text-primary" /></div>;

  const items = NAV[user.role] || NAV.student;
  const current = [...items].reverse().find((i) => pathname === i.href || pathname.startsWith(i.href + "/")) || items[0];
  const toggle = () => (window.innerWidth >= 1024 ? setCollapsed((c) => !c) : setMobile((m) => !m));
  const logout = async () => {
    await signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };
  const slim = collapsed;

  return (
    <div className="flex min-h-screen bg-base-200">
      {mobile && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobile(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-base-300 bg-base-100 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"} ${slim ? "lg:w-[4.75rem]" : "lg:w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-base-300 px-4">
          {slim ? <Link href="/" className="mx-auto hidden lg:block"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content font-display font-extrabold">M</span></Link> : null}
          <div className={slim ? "lg:hidden" : ""}><Logo /></div>
          <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setMobile(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className={`border-b border-base-300 p-4 ${slim ? "lg:flex lg:justify-center lg:p-3" : ""}`}>
          <div className="flex items-center gap-3">
            <Avatar src={user.image} name={user.name} size={slim ? 40 : 44} />
            <div className={`min-w-0 ${slim ? "lg:hidden" : ""}`}>
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-xs opacity-60">{user.email}</p>
              <div className="mt-1 flex gap-1">
                <span className="badge badge-primary badge-sm capitalize">{user.role}</span>
                {user.role !== "admin" && <span className={`badge badge-sm capitalize ${user.plan === "pro" ? "badge-accent" : "badge-ghost"}`}>{user.plan || "free"}</span>}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((i) => {
            const active = i.href === current.href;
            return (
              <Link key={i.href} href={i.href} title={i.label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-content" : "hover:bg-base-200"} ${slim ? "lg:justify-center" : ""}`}>
                <i.icon size={18} className="shrink-0" />
                <span className={slim ? "lg:hidden" : ""}>{i.label}</span>
              </Link>
            );
          })}
          {user.role !== "admin" && user.plan !== "pro" && (
            <Link href="/pricing" title="Upgrade to Pro" className={`mt-3 flex items-center gap-3 rounded-lg bg-accent/20 px-3 py-2.5 text-sm font-semibold text-base-content hover:bg-accent/30 ${slim ? "lg:justify-center" : ""}`}>
              <Crown size={18} className="shrink-0 text-accent" /><span className={slim ? "lg:hidden" : ""}>Upgrade to Pro</span>
            </Link>
          )}
        </nav>

        <div className="space-y-1 border-t border-base-300 p-3">
          <Link href="/" title="Back to website" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-base-200 ${slim ? "lg:justify-center" : ""}`}><Home size={18} className="shrink-0" /><span className={slim ? "lg:hidden" : ""}>Back to website</span></Link>
          <button onClick={logout} title="Sign Out" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/10 ${slim ? "lg:justify-center" : ""}`}><LogOut size={18} className="shrink-0" /><span className={slim ? "lg:hidden" : ""}>Sign Out</span></button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur md:px-6">
          <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm" aria-label="Toggle sidebar">
            <Menu size={20} className="lg:hidden" />
            {slim ? <PanelLeftOpen size={20} className="hidden lg:block" /> : <PanelLeftClose size={20} className="hidden lg:block" />}
          </button>
          <h2 className="font-display text-lg font-bold">{current.label}</h2>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Avatar src={user.image} name={user.name} size={34} />
            <div className="hidden text-sm leading-tight sm:block">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs capitalize opacity-60">{user.role}</p>
            </div>
          </div>
        </header>
        <main className="w-full flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
