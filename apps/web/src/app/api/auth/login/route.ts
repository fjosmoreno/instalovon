import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/passwords";
import { createSessionCookie } from "@/lib/auth";
import { handleError, HttpError, parseBody } from "@/lib/http";

const schema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, schema);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new HttpError(401, "Invalid email or password", "bad_credentials");
    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password", "bad_credentials");
    await createSessionCookie({ uid: user.id, email: user.email });
    return NextResponse.json({ data: { id: user.id, email: user.email } });
  } catch (err) {
    return handleError(err);
  }
}
