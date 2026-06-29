/**
 * Worker entry point. Boots config, preloads proxies, then loops on the queue.
 */
import { config } from "./config.js";
import { logger } from "./logger.js";
import { proxyRotator } from "./proxy.js";
import { claimNextJob } from "./queue.js";
import { runJob } from "./runner.js";

let stopping = false;

async function tick(): Promise<void> {
  try {
    const job = await claimNextJob();
    if (!job) return;
    const usernames = (job.usernames ?? []) as string[];
    if (usernames.length === 0) {
      logger.error({ jobId: job.id }, "job:no_usernames");
      return;
    }
    await runJob(job.id, usernames, job.mode as any, job.locale || "pt-BR");
  } catch (err) {
    logger.error({ err: (err as Error).message }, "tick:error");
  }
}

async function loop(): Promise<void> {
  while (!stopping) {
    await tick();
    await new Promise<void>((resolve) => setTimeout(resolve, config.pollIntervalMs));
  }
}

async function shutdown(signal: string): Promise<void> {
  if (stopping) return;
  stopping = true;
  logger.info({ signal }, "worker:shutdown");
  // Give the in-flight tick a moment to finish.
  setTimeout(() => process.exit(0), 1500).unref();
}

async function main(): Promise<void> {
  logger.info(
    {
      workerId: config.workerId,
      pollIntervalMs: config.pollIntervalMs,
      enableProxies: config.enableProxies,
      enableCrawler: config.enableCrawler,
    },
    "worker:boot"
  );

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("uncaughtException", (err) => {
    logger.error({ err: err.message, stack: err.stack }, "worker:uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason: String(reason) }, "worker:unhandledRejection");
  });

  await proxyRotator.load();
  await loop();
}

main().catch((err) => {
  logger.error({ err: err.message, stack: err.stack }, "worker:fatal");
  process.exit(1);
});
