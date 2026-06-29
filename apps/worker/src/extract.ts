/**
 * Instaloader subprocess wrapper. Calls the Python sidecar at
 * services/instaloader/extract.py and parses the JSON result.
 *
 * IMPORTANT: this runs the script as a child process. Never pass user-controlled
 * data straight to the shell — only safe argv.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { config } from "./config.js";
import { logger } from "./logger.js";
import type { InstagramProfileSnapshot } from "@instalovon/shared";

export interface ExtractOptions {
  username: string;
  maxPosts?: number;
  recentDays?: number;
}

export class ExtractError extends Error {
  constructor(
    message: string,
    public code: string,
    public stderr?: string
  ) {
    super(message);
    this.name = "ExtractError";
  }
}

export async function extractProfile(opts: ExtractOptions): Promise<InstagramProfileSnapshot> {
  const args = [
    config.extractScript,
    opts.username,
    "--max-posts",
    String(opts.maxPosts ?? config.maxPostsPerProfile),
    "--recent-days",
    String(opts.recentDays ?? config.recentDays),
  ];

  logger.info({ username: opts.username }, "extract:spawn");

  return await new Promise<InstagramProfileSnapshot>((resolve, reject) => {
    const child = spawn(config.instaloaderPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: config.extractTimeoutMs,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
      },
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGKILL");
      reject(
        new ExtractError(
          `extract timed out after ${config.extractTimeoutMs}ms`,
          "timeout",
          stderr
        )
      );
    }, config.extractTimeoutMs + 5000);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(
        new ExtractError(
          `failed to spawn extractor: ${err.message}`,
          "spawn_error",
          stderr
        )
      );
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      if (code !== 0) {
        let errCode = "unknown";
        let errMsg = stderr.trim() || `extractor exited with code ${code}`;
        try {
          // Instaloader errors are emitted as JSON in stderr
          const lines = stderr
            .split("\n")
            .filter((l) => l.trim().startsWith("{"))
            .map((l) => JSON.parse(l));
          if (lines.length && lines[lines.length - 1].error) {
            errMsg = String(lines[lines.length - 1].error);
            errCode = String(lines[lines.length - 1].code ?? "unknown");
          }
        } catch {
          // keep raw stderr
        }
        return reject(new ExtractError(errMsg, errCode, stderr));
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed as InstagramProfileSnapshot);
      } catch (err) {
        reject(
          new ExtractError(
            `failed to parse extractor output: ${(err as Error).message}`,
            "parse_error",
            stderr
          )
        );
      }
    });
  });
}

export function resolveExtractScriptPath(): string {
  return path.resolve(config.extractScript);
}
