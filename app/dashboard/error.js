"use client";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-error">Oops</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md opacity-70">{error?.message || "An unexpected error occurred."} Try again, or go back to the home page.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => reset()} className="btn btn-outline">Try again</button>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </main>
  );
}
