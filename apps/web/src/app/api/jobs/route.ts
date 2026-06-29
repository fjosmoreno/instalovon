import { NextResponse } from "next/server";
import { createJobSchema } from "@instalovon/shared/zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { handleError, HttpError, parseBody } from "@/lib/http";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await parseBody(req, createJobSchema);
    const job = await prisma.job.create({
      data: {
        userId: user.id,
        mode: body.mode ?? "single_profile",
        usernames: body.usernames,
        recentDays: body.recentDays ?? 30,
        locale: body.locale ?? "pt-BR",
        status: "pending",
      },
    });
    return NextResponse.json({ data: { id: job.id, status: job.status } });
  } catch (err) {
    return handleError(err);
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        mode: true,
        usernames: true,
        status: true,
        createdAt: true,
        finishedAt: true,
      },
    });
    return NextResponse.json({ data: jobs });
  } catch (err) {
    return handleError(err);
  }
}
