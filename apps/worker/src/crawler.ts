/**
 * Crawlee + Playwright helpers. Disabled in MVP by default — Instaloader does
 * the heavy lifting for metadata. Crawlee is wired in here so future feature
 * work (trending hashtag posts, story snapshots, public mention crawling)
 * has a place to live.
 */
import { logger } from "./logger.js";
import { config } from "./config.js";

export class CrawlerDisabledError extends Error {
  constructor() {
    super("Crawler is disabled (set ENABLE_CRAWLER=1 to activate)");
    this.name = "CrawlerDisabledError";
  }
}

/**
 * Lazily import crawlee + playwright. Only when ENABLE_CRAWLER=1.
 */
export async function maybeRunCrawler<T>(
  fn: (deps: {
    playwright: typeof import("playwright");
    crawlee: typeof import("crawlee");
  }) => Promise<T>
): Promise<T> {
  if (!config.enableCrawler) throw new CrawlerDisabledError();
  logger.warn("crawler:enabled (this path is experimental, use with care)");
  const playwright = await import("playwright");
  const crawlee = await import("crawlee");
  return await fn({ playwright, crawlee });
}
