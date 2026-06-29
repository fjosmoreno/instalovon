/**
 * Free-proxy loader for the worker. Disabled by default. Activated via
 * ENABLE_FREE_PROXIES=1. Sourced from a public free list at startup
 * (PROXY_LIST_URL) and rotated round-robin. If a proxy fails twice in a row,
 * it gets demoted to the end of the queue.
 *
 * IMPORTANT — this is for the MVP only. Free public proxies are unreliable
 * and frequently already blocked by Instagram. For production scale use a
 * paid provider (Bright Data, SmartProxy, Oxylabs).
 */
import { logger } from "./logger.js";
import { config } from "./config.js";

interface ProxyEntry {
  url: string;
  failures: number;
}

export class ProxyRotator {
  private proxies: ProxyEntry[] = [];
  private cursor = 0;
  private loaded = false;

  async load(): Promise<number> {
    if (!config.enableProxies) {
      logger.info("proxy:disabled (set ENABLE_FREE_PROXIES=1 to activate)");
      return 0;
    }
    try {
      const res = await fetch(config.proxyListUrl, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^\d+\.\d+\.\d+\.\d+:\d+$/.test(line))
        .map((line) => ({ url: `http://${line}`, failures: 0 }));
      this.proxies = parsed.slice(0, 80); // cap at 80 to keep things sane
      this.loaded = true;
      logger.info({ count: this.proxies.length }, "proxy:loaded");
      return this.proxies.length;
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "proxy:load_failed");
      return 0;
    }
  }

  next(): string | null {
    if (!this.loaded || this.proxies.length === 0) return null;
    const entry = this.proxies[this.cursor % this.proxies.length];
    this.cursor = (this.cursor + 1) % this.proxies.length;
    return entry?.url ?? null;
  }

  /** Called after a request using this proxy failed. */
  penalize(proxyUrl: string | null): void {
    if (!proxyUrl) return;
    const idx = this.proxies.findIndex((p) => p.url === proxyUrl);
    if (idx === -1) return;
    const entry = this.proxies[idx]!;
    entry.failures += 1;
    if (entry.failures >= 3) {
      // Drop the entry entirely; it is dead.
      this.proxies.splice(idx, 1);
      logger.warn({ proxy: proxyUrl, remaining: this.proxies.length }, "proxy:dropped");
    }
  }

  size(): number {
    return this.proxies.length;
  }
}

export const proxyRotator = new ProxyRotator();
