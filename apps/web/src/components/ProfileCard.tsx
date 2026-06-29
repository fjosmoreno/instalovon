import type { InstagramProfileSnapshot } from "@instalovon/shared";
import { formatNumber } from "@/lib/format";

export function ProfileCard({ profile }: { profile: InstagramProfileSnapshot }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-soft/15 blur-2xl" />

      <div className="flex items-center gap-3">
        {profile.profilePicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profilePicUrl}
            alt={profile.username}
            className="h-14 w-14 rounded-full border border-white/[0.07] object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary-soft via-primary to-primary-deep" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold tracking-tight">
              @{profile.username}
            </span>
            {profile.isVerified ? (
              <span className="pill-brand">verified</span>
            ) : null}
            {profile.isBusiness ? <span className="pill">business</span> : null}
          </div>
          <div className="mt-0.5 text-[12px] text-ink-300">
            {profile.fullName ?? "—"}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-200">
        {profile.biography || "No bio."}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Stat label="Followers" value={profile.followers} />
        <Stat label="Following" value={profile.follows} />
        <Stat label="Posts" value={profile.postsCount} />
      </div>

      {profile.topHashtags.length ? (
        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/80">
            Top hashtags
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.topHashtags.slice(0, 8).map((h) => (
              <span
                key={h}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-ink-200"
              >
                #{h}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {profile.recentPosts.length ? (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/80">
              Recent posts
            </div>
            <span className="text-[11px] text-ink-300">
              {profile.recentPosts.length} sampled
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {profile.recentPosts.slice(0, 4).map((p) => (
              <li
                key={p.shortcode}
                className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5"
              >
                <span className="pill shrink-0">{p.type}</span>
                <span className="line-clamp-2 flex-1 text-xs text-ink-100">
                  {p.caption
                    ? p.caption.slice(0, 110) +
                      (p.caption.length > 110 ? "…" : "")
                    : "(no caption)"}
                </span>
                <span className="ml-1 whitespace-nowrap text-[11px] text-cream-soft">
                  {formatNumber(p.likes)}♥ · {formatNumber(p.comments)}💬
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5">
      <div className="font-display text-base font-semibold">
        {formatNumber(value)}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-ink-300">
        {label}
      </div>
    </div>
  );
}
