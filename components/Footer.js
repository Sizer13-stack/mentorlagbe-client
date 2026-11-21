import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import Logo from "./Logo";
import { XLogo } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm opacity-70">Verified tutors, transparent fees, and batches that fit your schedule. Learning support that is easy to find.</p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: XLogo, label: "X" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-base-300 bg-base-100 transition-colors hover:bg-primary hover:text-primary-content">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold">Quick links</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/tuitions" className="hover:text-primary">Browse Tuitions</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="/about" className="hover:text-primary">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold">For you</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link href="/sign-up" className="hover:text-primary">Join as a Student</Link></li>
            <li><Link href="/sign-up" className="hover:text-primary">Join as a Tutor</Link></li>
            <li><Link href="/sign-in" className="hover:text-primary">Sign In</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> hello@mentorlagbe.com</li>
            <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> +880 1700-000000</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> House 12, Road 5, Dhanmondi, Dhaka 1205</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-300 py-5 text-center text-sm opacity-70">
        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}
