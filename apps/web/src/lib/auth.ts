/**
 * Cookie-based auth session. JWT signed with `jose`.
 *
 * Trade-offs (intentional for MVP):
 * - HS256 with a single secret. Swap to rotating keys when scaling.
 * - Session lifetime 30 days. Refreshed on each request.
 * - Passwords are bcrypt-hashed in `lib/passwords.ts`.
 */
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE_NAME = "instalovon_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30d

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET env var is required (min 16 chars). Add it to .env / Vercel env."
    );
  }
  return new TextEncoder().encode(s);
}

export interface SessionPayload extends JWTPayload {
  uid: string;
  email: string;
}

export async function createSessionCookie(payload: SessionPayload): Promise<void> {
  const secret = getSecret();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify<SessionPayload>(token, secret);
    if (typeof payload.uid !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
