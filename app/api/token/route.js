import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Issues a short-lived JWT for the logged-in BetterAuth session.
// The Express server verifies it with the shared JWT_SECRET (verifyToken middleware).
export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ email: session.user.email, role: session.user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  return NextResponse.json({ token });
}
