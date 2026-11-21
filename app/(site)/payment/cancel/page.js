import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment cancelled | MentorLagbe" };

export default function Cancel() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-14 text-center">
      <div>
        <XCircle className="mx-auto text-warning" size={64} />
        <h1 className="mt-4 font-display text-3xl font-bold">Payment cancelled</h1>
        <p className="mt-2 max-w-md opacity-70">No charge was made. You can upgrade to Pro whenever you are ready.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/pricing" className="btn btn-primary">Back to pricing</Link>
          <Link href="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
