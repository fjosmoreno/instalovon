#!/usr/bin/env python3
"""
Instaloader extractor (Insta Lovon sidecar).

Usage:
  python extract.py <username> [--max-posts N] [--recent-days N] [--no-videos]

Outputs JSON to stdout with shape:
{
  "username": "...",
  "fullName": "...",
  "biography": "...",
  "externalUrl": "...",
  "followers": 0,
  "follows": 0,
  "postsCount": 0,
  "isVerified": false,
  "isPrivate": false,
  "isBusiness": false,
  "profilePicUrl": "...",
  "fetchedAt": "ISO-8601",
  "recentPosts": [...],
  "topHashtags": [".."]
}

Errors (rate limit, private profile, not found) are reported on stderr as
JSON {"error": "...", "code": "..."} and exit with non-zero status.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from collections import Counter
from datetime import datetime, timezone
from typing import Any

import instaloader


HASHTAG_RE = re.compile(r"#(\w+)")
MENTION_RE = re.compile(r"@(\w+)")


def _safe_str(v: Any) -> str | None:
    if v is None:
        return None
    s = str(v)
    return s or None


def _post_type(post: instaloader.Post) -> str:
    typename = getattr(post, "typename", "") or ""
    if typename in ("GraphImage",):
        return "image"
    if typename in ("GraphVideo",):
        typename_video = getattr(post, "is_video", False)
        return "reel" if typename_video and "reel" in (post.url or "") else "video"
    if typename in ("GraphSidecar",):
        return "carousel"
    return "image"


def _extract_post(post: instaloader.Post) -> dict[str, Any]:
    caption = getattr(post, "caption", None)
    caption_text = caption if isinstance(caption, str) else None
    hashtags = HASHTAG_RE.findall(caption_text or "")
    mentions = MENTION_RE.findall(caption_text or "")

    ptype = _post_type(post)
    if ptype == "video" and "reel" in (post.url or ""):
        ptype = "reel"

    return {
        "shortcode": post.shortcode,
        "url": f"https://www.instagram.com/p/{post.shortcode}/",
        "caption": caption_text,
        "likes": int(post.likes or 0),
        "comments": int(post.comments or 0),
        "timestamp": (post.date_utc or datetime.now(timezone.utc))
        .astimezone(timezone.utc)
        .isoformat()
        .replace("+00:00", "Z"),
        "type": ptype,
        "hashtags": hashtags,
        "mentions": mentions,
    }


def extract(username: str, max_posts: int, recent_days: int) -> dict[str, Any]:
    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
        request_timeout=30,
        max_connection_attempts=2,
    )

    try:
        profile = instaloader.Profile.from_username(loader.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        _emit_error("profile_not_found", f"Profile @{username} does not exist")
        sys.exit(2)
    except instaloader.exceptions.ConnectionException as exc:
        _emit_error("connection_error", str(exc))
        sys.exit(3)
    except instaloader.exceptions.LoginRequiredException:
        _emit_error(
            "login_required",
            "Profile is private or requires login; only public data is allowed.",
        )
        sys.exit(4)
    except instaloader.exceptions.PrivateProfileNotFollowedException:
        _emit_error("private", f"Profile @{username} is private.")
        sys.exit(5)

    if profile.is_private:
        _emit_error("private", f"Profile @{username} is private.")
        sys.exit(5)

    snap: dict[str, Any] = {
        "username": profile.username,
        "fullName": _safe_str(profile.full_name),
        "biography": _safe_str(profile.biography),
        "externalUrl": _safe_str(profile.external_url),
        "followers": int(profile.followers or 0),
        "follows": int(profile.followees or 0),
        "postsCount": int(profile.mediacount or 0),
        "isVerified": bool(profile.is_verified),
        "isPrivate": bool(profile.is_private),
        "isBusiness": bool(profile.is_business_account),
        "profilePicUrl": _safe_str(profile.profile_pic_url),
        "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "recentPosts": [],
        "topHashtags": [],
    }

    posts: list[dict[str, Any]] = []
    hashtag_counter: Counter[str] = Counter()

    cutoff_ts = time.time() - (recent_days * 86400)

    try:
        feed_iter = profile.get_posts()
        for i, post in enumerate(feed_iter):
            if i >= max_posts:
                break
            try:
                p = _extract_post(post)
            except Exception:
                continue
            # Filter by recent window if post timestamp available
            try:
                if post.date_utc and post.date_utc.timestamp() < cutoff_ts:
                    continue
            except Exception:
                pass
            posts.append(p)
            for tag in p["hashtags"]:
                hashtag_counter[tag.lower()] += 1
            # Be polite to Instagram: small sleep between posts
            time.sleep(0.3)
    except instaloader.exceptions.ConnectionException as exc:
        # Partial result is OK
        sys.stderr.write(
            json.dumps(
                {"warning": "partial_result", "reason": str(exc), "collected": len(posts)}
            )
            + "\n"
        )

    snap["recentPosts"] = posts
    snap["topHashtags"] = [tag for tag, _ in hashtag_counter.most_common(20)]

    print(json.dumps(snap, ensure_ascii=False))
    return snap


def _emit_error(code: str, message: str) -> None:
    payload = json.dumps({"error": message, "code": code})
    sys.stderr.write(payload + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Instaloader sidecar for Insta Lovon")
    parser.add_argument("username", help="Instagram username (without @)")
    parser.add_argument("--max-posts", type=int, default=12, help="max recent posts (default 12)")
    parser.add_argument(
        "--recent-days",
        type=int,
        default=30,
        help="only keep posts newer than N days (default 30)",
    )
    args = parser.parse_args()

    extract(args.username, args.max_posts, args.recent_days)


if __name__ == "__main__":
    main()
