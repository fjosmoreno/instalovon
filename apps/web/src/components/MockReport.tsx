export function MockReport() {
  return (
    <div className="grid gap-0 lg:grid-cols-[1.2fr,1fr]">
      {/* summary */}
      <div className="border-b border-white/[0.06] p-8 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2">
          <span className="pill-brand">AI summary</span>
          <span className="text-[11px] text-ink-300">· gemini-2.5-flash</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          Strong reel velocity, posting cadence can scale.
        </h3>
        <p className="mt-3 text-sm leading-6 text-ink-200">
          @brandaudit grew followers 12.8% over the last 12 weeks while reels
          engagement climbed to 4.2% — well above the 1.6% niche baseline.
          Carousel posts still drive the most reach, but the account is
          under-exploiting the educational pillar of its content mix. We
          recommend doubling posting cadence in the next 30 days and routing
          60% of new reels through trending niche sounds.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { k: "Strengths", items: ["Reels +28% engagement", "Niche hashtag mix", "Verified & consistent"] },
            { k: "Weaknesses", items: ["Cadence 2.1×/wk (benchmark 4)", "CTA missing on posts"] },
            { k: "Opportunities", items: ["Educational carousels", "Trending audio on Reels"] },
            { k: "Risk flags", items: ["Follower spike May 14 — verify organic"] },
          ].map((c) => (
            <div key={c.k} className="card-tight">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/80">
                {c.k}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink-100">
                {c.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cream-soft/70" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* profile + sample posts */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary-soft via-primary to-primary-deep" />
          <div>
            <div className="font-display text-base font-semibold tracking-tight">
              @brandaudit
            </div>
            <div className="text-[12px] text-ink-300">
              142K followers · 480 posts
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { t: "Reach", v: "1.8M" },
            { t: "Engagement", v: "3.7%" },
            { t: "Avg likes", v: "5.2K" },
          ].map((s) => (
            <div key={s.t} className="card-tight text-center">
              <div className="font-display text-lg font-semibold">{s.v}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-ink-300">
                {s.t}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/80">
            Top hashtags
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["branding", "designstudio", "logodesign", "brandstrategy", "uiux", "creative"].map(
              (h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-ink-200"
                >
                  #{h}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/80">
            Recent posts
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-ink-200">
            {[
              ["5.3K♥ · 142💬", "Reel · 3 min read", "Reels perform best at 18h"],
              ["4.1K♥ · 96💬", "Carousel · 5 slides", "Strong saves per post"],
              ["3.9K♥ · 88💬", "Reel · 90s", "Trending sound boosted reach"],
            ].map(([m, t, note], i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2"
              >
                <span className="font-medium text-cream">{m}</span>
                <span className="text-ink-300">{t}</span>
                <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-cream-soft/70">
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
