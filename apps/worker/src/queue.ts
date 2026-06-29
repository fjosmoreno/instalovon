/**
 * Job queue backed by Postgres. Uses SELECT ... FOR UPDATE SKIP LOCKED so
 * multiple worker instances can poll the same table safely without external
 * dependencies (Redis, Rabbit, etc).
 *
 * For low/MVP throughput this is fine. When scale matters, swap this module
 * for BullMQ + Redis (the interface stays identical).
 */
import { prisma } from "@instalovon/db";
import type { Job } from "@prisma/client";
import { logger } from "./logger.js";
import { config } from "./config.js";

/**
 * Atomically claim the next pending job by setting status='running'. Returns
 * null if nothing is pending right now.
 *
 * Postgres-only. Uses a transaction with row-level lock.
 */
export async function claimNextJob(): Promise<Job | null> {
  // We can't use FOR UPDATE SKIP LOCKED directly via Prisma, so we do it raw.
  const claimed = await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Job"
      WHERE status = 'pending'
      ORDER BY "createdAt" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `;
    if (rows.length === 0) return null;
    const id = rows[0]!.id;
    const job = await tx.job.update({
      where: { id },
      data: {
        status: "running",
        workerId: config.workerId,
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return job;
  });

  if (claimed) {
    logger.info({ jobId: claimed.id, workerId: config.workerId }, "queue:claimed");
  }
  return claimed;
}

export async function markJobSucceeded(
  jobId: string,
  data: {
    profileData: unknown;
    report: unknown;
  }
): Promise<void> {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "succeeded",
      finishedAt: new Date(),
      profileData: data.profileData as any,
      report: data.report as any,
      updatedAt: new Date(),
    },
  });
  logger.info({ jobId }, "queue:succeeded");
}

export async function markJobFailed(jobId: string, errorMessage: string): Promise<void> {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "failed",
      finishedAt: new Date(),
      errorMessage: errorMessage.slice(0, 1000),
      updatedAt: new Date(),
    },
  });
  logger.error({ jobId, errorMessage }, "queue:failed");
}

export async function cacheProfileSnapshot(username: string, snapshot: unknown): Promise<void> {
  await prisma.profileCache.upsert({
    where: { username },
    create: {
      username,
      lastFetchedAt: new Date(),
      snapshot: snapshot as any,
    },
    update: {
      lastFetchedAt: new Date(),
      snapshot: snapshot as any,
    },
  });
}

export async function getCachedProfile(
  username: string,
  maxAgeMs: number
): Promise<unknown | null> {
  const cached = await prisma.profileCache.findUnique({ where: { username } });
  if (!cached) return null;
  const age = Date.now() - cached.lastFetchedAt.getTime();
  if (age > maxAgeMs) return null;
  return cached.snapshot;
}
