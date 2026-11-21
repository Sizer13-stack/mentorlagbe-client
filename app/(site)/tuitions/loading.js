import { GridSkeleton } from "@/components/ui";

export default function Loading() {
  return <div className="container-x py-12"><GridSkeleton n={9} /></div>;
}
