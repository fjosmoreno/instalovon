export function Logo3D() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* outer ring */}
      <div className="absolute inset-0 rounded-[36px] border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl" />
      {/* glows */}
      <div className="absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-br from-primary-soft/40 via-primary/30 to-transparent blur-3xl" />
      <div className="absolute inset-6 -z-10 rounded-[28px] bg-gradient-to-tr from-cream-soft/10 to-primary-soft/30 blur-2xl" />

      {/* mock Instagram profile card */}
      <div className="absolute inset-8 flex flex-col justify-between rounded-[24px] border border-white/10 bg-ink-900/60 p-6 backdrop-blur-xl shadow-card">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 rounded-full p-[2px] bg-gradient-to-tr from-cream-soft via-primary-soft to-primary">
            <div className="h-full w-full rounded-full bg-ink-900" />
          </div>
          <div>
            <div className="font-display text-base font-semibold tracking-tight">
              @brandaudit
            </div>
            <div className="text-xs text-ink-300">Verified · São Paulo, BR</div>
          </div>
          <span className="ml-auto pill-brand">live</span>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Followers", v: "142K" },
              { k: "Engagement", v: "3.7%" },
              { k: "Posts/wk", v: "4.2" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
              >
                <div className="font-display text-base font-semibold">
                  {s.v}
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-ink-300">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-soft">
                AI insights
              </div>
              <span className="text-[10px] text-ink-300">just now</span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-ink-100">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cream-soft" />
                <span>Reels engagement +28% vs. last 30 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-soft" />
                <span>Posting cadence is below niche baseline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cream-soft/70" />
                <span>Hashtag mix is healthy and on-niche</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-300">
          <span>Generated in 38s</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            audit ready
          </span>
        </div>
      </div>
    </div>
  );
}
