/**
 * Worker configuration. Reads env with sensible defaults for local dev.
 * For production (Railway, Fly, etc) every value should come from env.
 */
import process from "node:process";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function intOr(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function boolOr(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v == null) return fallback;
  return v === "1" || v.toLowerCase() === "true";
}

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? required("DATABASE_URL"),
  geminiApiKey: process.env.GEMINI_API_KEY ?? required("GEMINI_API_KEY"),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  workerId:
    process.env.WORKER_ID ??
    `worker-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
  pollIntervalMs: intOr("WORKER_POLL_INTERVAL_MS", 5000),
  jobTimeoutMs: intOr("WORKER_JOB_TIMEOUT_MS", 5 * 60_000),
  instaloaderPath: process.env.INSTALOADER_PATH ?? "python3",
  extractScript:
    process.env.INSTALOADER_SCRIPT ??
    new URL("../../../../services/instaloader/extract.py", import.meta.url).pathname,
  extractTimeoutMs: intOr("INSTALOADER_TIMEOUT_MS", 90_000),
  maxPostsPerProfile: intOr("MAX_POSTS_PER_PROFILE", 12),
  recentDays: intOr("RECENT_DAYS", 30),
  enableCrawler: boolOr("ENABLE_CRAWLER", false),
  enableProxies: boolOr("ENABLE_FREE_PROXIES", false),
  proxyListUrl:
    process.env.PROXY_LIST_URL ?? "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all",
  aiEnabled: boolOr("AI_ENABLED", true),
};

export type WorkerConfig = typeof config;
