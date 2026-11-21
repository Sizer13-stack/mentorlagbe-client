"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui";
import { fmtDate } from "@/lib/constants";

function Result() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    if (!sessionId) return setState({ status: "error", message: "No payment session was found." });
    api("/payments/verify", { method: "POST", body: { sessionId } })
      .then((r) => setState({ status: "ok", payment: r.payment }))
      .catch((e) => setState({ status: "error", message: e.message }));
  }, [sessionId]);

  if (state.status === "loading")
    return <div className="flex flex-col items-center gap-4 py-10"><Spinner className="loading-lg" /><p>Confirming your payment...</p></div>;

  if (state.status === "error")
    return (
      <div className="text-center">
        <XCircle className="mx-auto text-error" size={64} />
        <h1 className="mt-4 font-display text-3xl font-bold">We couldn&apos;t confirm your payment</h1>
        <p className="mt-2 opacity-70">{state.message}</p>
        <Link href="/pricing" className="btn btn-primary mt-6">Back to pricing</Link>
      </div>
    );

  const p = state.payment;
  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto text-success" size={64} />
      <h1 className="mt-4 font-display text-3xl font-bold">You are now on Pro!</h1>
      <p className="mt-2 opacity-70">Your {p.planName} is active. Thank you for upgrading.</p>
      <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-box border border-base-300 p-4 text-left text-sm">
        <div className="flex justify-between"><dt className="opacity-60">Plan</dt><dd className="font-semibold">{p.planName}</dd></div>
        <div className="flex justify-between"><dt className="opacity-60">Amount</dt><dd className="font-semibold">${p.amount} {p.currency?.toUpperCase()}</dd></div>
        <div className="flex justify-between gap-4"><dt className="opacity-60">Transaction</dt><dd className="truncate font-semibold">{p.transactionId}</dd></div>
        <div className="flex justify-between"><dt className="opacity-60">Date</dt><dd className="font-semibold">{fmtDate(p.paidAt)}</dd></div>
      </dl>
      {/* full page load so the session shows the new plan */}
      <a href="/dashboard" className="btn btn-primary mt-6">Go to dashboard</a>
    </div>
  );
}

export default function Success() {
  return <div className="container-x grid min-h-[60vh] place-items-center py-14"><Suspense><Result /></Suspense></div>;
}
