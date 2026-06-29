import { prisma } from "./db";
import { readSessionCookie } from "./auth";
import type { User } from "@prisma/client";

/**
 * Returns the authenticated user or null.
 */
export async function currentUser(): Promise<User | null> {
  const session = await readSessionCookie();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.uid } });
  return user;
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new HttpError(401, "Authentication required", "unauthorized");
  return u;
}

import { HttpError } from "./http";
