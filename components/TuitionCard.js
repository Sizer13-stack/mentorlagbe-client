import Link from "next/link";
import { BadgeCheck, Heart, Star } from "lucide-react";
import Avatar from "./Avatar";
import { taka } from "@/lib/constants";

// every card has the same height/width: fixed image ratio, clamped title, button pinned to the bottom
export default function TuitionCard({ t, saved, onToggleSave }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition-shadow hover:shadow-xl">
      <div className="relative aspect-[16/9] overflow-hidden bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.bannerImage} alt={t.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <span className={`badge absolute left-3 top-3 border-0 ${t.mode === "Online" ? "badge-info" : "badge-secondary"}`}>{t.mode}</span>
        {onToggleSave && (
          <button onClick={() => onToggleSave(t._id)} aria-label="Save tuition" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-base-100/90 shadow">
            <Heart size={16} className={saved ? "fill-error text-error" : ""} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-primary badge-outline">{t.subject}</span>
          <span className="text-sm opacity-70">{t.classLevel}</span>
        </div>
        <h3 className="line-clamp-2 min-h-[3.4rem] font-display text-lg font-bold leading-snug">{t.title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <Avatar name={t.tutorName} size={26} />
          <span className="truncate font-medium">{t.tutorName}</span>
          {t.tutorVerified && <BadgeCheck size={16} className="shrink-0 text-info" aria-label="Verified tutor" />}
        </div>
        <div className="mt-auto flex items-end justify-between pt-1">
          <p><span className="font-display text-2xl font-bold">{taka(t.monthlyFee)}</span><span className="text-xs opacity-60"> /month</span></p>
          {t.ratingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold"><Star size={14} className="fill-accent text-accent" />{t.ratingAvg}<span className="font-normal opacity-60">({t.ratingCount})</span></span>
          )}
        </div>
        <Link href={`/tuitions/${t._id}`} className="btn btn-primary btn-sm w-full">View Details</Link>
      </div>
    </article>
  );
}
