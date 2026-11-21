import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found | MentorLagbe" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">This page doesn&apos;t exist</h1>
        <p className="mt-3 max-w-md opacity-70">The link may be broken or the page may have been removed. Head back home to keep looking for your tutor.</p>
        <Link href="/" className="btn btn-primary mt-8">Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
