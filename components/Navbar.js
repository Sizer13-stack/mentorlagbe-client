"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, UserCog, LogOut } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    clearToken();
    toast.success("Signed out successfully");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-base-200 ${active(l.href) ? "text-primary" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-40 animate-pulse rounded-lg bg-base-300" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-base-200">
                  <Avatar src={user.image} name={user.name} size={34} />
                  <div className="text-left leading-tight">
                    <p className="max-w-[120px] truncate text-sm font-semibold">{user.name}</p>
                    <span className="badge badge-primary badge-sm capitalize">{user.role}</span>
                  </div>
                </div>
                <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                  <li><Link href="/dashboard"><LayoutDashboard size={16} /> Dashboard</Link></li>
                  <li><Link href="/dashboard/profile"><UserCog size={16} /> Update Profile</Link></li>
                  <li><button onClick={handleSignOut} className="text-error"><LogOut size={16} /> Sign Out</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 font-semibold hover:bg-base-200 ${active(l.href) ? "text-primary" : ""}`}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-base-300 pt-3">
              {user ? (
                <>
                  <div className="mb-2 flex items-center gap-3 px-3">
                    <Avatar src={user.image} name={user.name} size={40} />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <span className="badge badge-primary badge-sm capitalize">{user.role}</span>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-base-200">Dashboard</Link>
                  <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-base-200">Update Profile</Link>
                  <button onClick={handleSignOut} className="btn btn-outline btn-error btn-sm mt-2 w-full">Sign Out</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-outline btn-sm">Sign In</Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
