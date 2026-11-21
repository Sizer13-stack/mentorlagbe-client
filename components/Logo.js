import Link from "next/link";
import { GraduationCap } from "lucide-react";

// Same size & style everywhere (navbar, footer, dashboard)
export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
        <GraduationCap size={20} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">MentorLagbe</span>
    </Link>
  );
}
