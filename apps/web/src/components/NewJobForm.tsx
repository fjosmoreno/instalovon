"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Spinner } from "@/components/icons";

export function NewJobForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"single_profile" | "compare_profiles">(
    "single_profile"
  );
  const [locale, setLocale] = useState("pt-BR");
  const [recentDays, setRecentDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parseUsernames(text: string): string[] {
    return text
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) =>
        s
          .replace(/^https?:\/\/[^/]*instagram\.com\//, "")
          .replace(/\/$/, "")
          .replace(/^@/, "")
      )
      .filter(Boolean);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const usernames = parseUsernames(username);
    if (usernames.length === 0) {
      setError("Provide at least one Instagram username or profile URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: usernames.length > 1 ? "compare_profiles" : mode,
          usernames,
          recentDays,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Failed to create job");
        return;
      }
      router.push(`/jobs/${data.data.id}`);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      <div>
        <label className="label">Profile URL or username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@exemplo or https://www.instagram.com/exemplo"
          required
        />
        <p className="mt-2 text-xs text-ink-300">
          Separate multiple profiles with commas for comparison.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="label">Mode</label>
          <select
            className="input"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="single_profile">Single profile</option>
            <option value="compare_profiles">Compare profiles</option>
          </select>
        </div>
        <div>
          <label className="label">Report language</label>
          <select
            className="input"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div>
          <label className="label">Recent posts (days)</label>
          <input
            type="number"
            className="input"
            min={1}
            max={365}
            value={recentDays}
            onChange={(e) => setRecentDays(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="rounded-xl border border-cream-soft/15 bg-cream-soft/[0.04] px-4 py-3 text-xs text-cream-soft/90">
        We only analyze <strong className="text-cream">public</strong> profiles.
        Private profiles, login-gated content, and media downloads are
        intentionally out of scope.
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner className="h-4 w-4 animate-spin" /> Creating job…
          </>
        ) : (
          <>
            Analyze now <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
