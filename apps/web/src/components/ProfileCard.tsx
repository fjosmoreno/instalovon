import type { InstagramProfileSnapshot } from "@instalovon/shared";
import { formatNumber } from "@/lib/format";

export function ProfileCard({ profile }: { profile: InstagramProfileSnapshot }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        {profile.profilePicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profilePicUrl}
            alt={profile.username}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand to-brand-deep" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink-900">@{profile.username}</span>
            {profile.isVerified ? <span className="pill-brand">verified</span> : null}
            {profile.isBusiness ? <span className="pill">business</span> : null}
          </div>
          <div className="text-xs text-ink-500">{profile.fullName ?? "—"}</div>
        </div>
      </div>
      <p className="mt-3 line-clamp-4 text-sm text-ink-600">
        {profile.biography || "No bio."}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <Stat label="Followers" value={profile.followers} />
        <Stat label="Following" value={profile.follows} />
        <Stat label="Posts" value={profile.postsCount} />
      </div>
      {profile.topHashtags.length ? (
        <div className="mt-4 flex flex-wrap gap-1">
          {profile.topHashtags.slice(0, 8).map((h) => (
            <span key={h} className="pill">
              #{h}
            </span>
          ))}
        </div>
      ) : null}
      {profile.recentPosts.length ? (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Recent posts ({profile.recentPosts.length})
          </div>
          <ul className="mt-2 space-y-2">
            {profile.recentPosts.slice(0, 4).map((p) => (
              <li key={p.shortcode} className="flex items-start gap-2 text-xs text-ink-700">
                <span className="pill">{p.type}</span>
                <span className="flex-1">
                  {p.caption ? p.caption.slice(0, 100) + (p.caption.length > 100 ? "…" : "") : "(no caption)"}
                </span>
                <span className="whitespace-nowrap text-ink-500">
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
    <div className="rounded-xl bg-ink-50 p-2">
      <div className="text-base font-semibold text-ink-900">{formatNumber(value)}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}
