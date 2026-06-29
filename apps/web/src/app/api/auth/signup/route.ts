import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { createSessionCookie } from "@/lib/auth";
import { handleError, HttpError, parseBody } from "@/lib/http";

const schema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, schema);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new HttpError(409, "An account with this email already exists", "email_taken");

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name ?? null,
        passwordHash,
      },
    });
    await createSessionCookie({ uid: user.id, email: user.email });
    return NextResponse.json({ data: { id: user.id, email: user.email } });
  } catch (err) {
    return handleError(err);
  }
}
