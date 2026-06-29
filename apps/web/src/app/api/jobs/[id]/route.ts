import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { handleError, HttpError } from "@/lib/http";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const job = await prisma.job.findFirst({
      where: { id, userId: user.id },
    });
    if (!job) throw new HttpError(404, "Job not found", "not_found");
    return NextResponse.json({ data: job });
  } catch (err) {
    return handleError(err);
  }
}
