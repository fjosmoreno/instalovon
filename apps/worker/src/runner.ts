/**
 * Job runner. Pulls a claimed job, extracts each username, then asks Gemini
 * for the report.
 */
import { generateReport } from "@instalovon/ai";
import type { InstagramProfileSnapshot, JobMode } from "@instalovon/shared";
import { extractProfile, ExtractError } from "./extract.js";
import {
  cacheProfileSnapshot,
  getCachedProfile,
  markJobFailed,
  markJobSucceeded,
} from "./queue.js";
import { logger } from "./logger.js";
import { config } from "./config.js";

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6h

export async function runJob(jobId: string, usernames: string[], mode: JobMode, locale: string): Promise<void> {
  logger.info({ jobId, usernames, mode }, "job:start");

  const profiles: InstagramProfileSnapshot[] = [];
  const errors: Record<string, string> = {};

  for (const username of usernames) {
    try {
      // 1) Try cache first.
      const cached = (await getCachedProfile(username, CACHE_TTL_MS)) as
        | InstagramProfileSnapshot
        | null;
      let snapshot: InstagramProfileSnapshot;
      if (cached) {
        logger.info({ username }, "job:cache_hit");
        snapshot = cached;
      } else {
        snapshot = await extractProfile({ username });
        await cacheProfileSnapshot(username, snapshot);
      }
      profiles.push(snapshot);
    } catch (err) {
      const code = err instanceof ExtractError ? err.code : "unknown";
      errors[username] = `${code}: ${(err as Error).message}`;
      logger.warn({ username, code, err: (err as Error).message }, "job:profile_failed");
    }
  }

  if (profiles.length === 0) {
    const summary = Object.entries(errors)
      .map(([u, e]) => `@${u} — ${e}`)
      .join("; ");
    await markJobFailed(
      jobId,
      `All profiles failed to extract. ${summary || "No data returned."}`
    );
    return;
  }

  // 2) AI report (best-effort; failures here still produce data on the job).
  if (config.aiEnabled) {
    try {
      const report = await generateReport(profiles, { locale });
      await markJobSucceeded(jobId, {
        profileData: profiles,
        report,
      });
      logger.info({ jobId }, "job:done_with_report");
    } catch (err) {
      logger.error({ jobId, err: (err as Error).message }, "job:report_failed");
      await markJobSucceeded(jobId, {
        profileData: profiles,
        report: null,
      });
    }
  } else {
    await markJobSucceeded(jobId, {
      profileData: profiles,
      report: null,
    });
  }
}
