import { StatsSkeleton, TableSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded bg-base-300" />
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );
}
