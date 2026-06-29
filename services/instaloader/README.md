# Instaloader sidecar

Lightweight Python wrapper that the Node worker calls to extract public Instagram
profile metadata via [Instaloader](https://instaloader.github.io/) (MIT).

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python extract.py natgeo --max-posts 12 --recent-days 30
```

Output is JSON on stdout, errors on stderr as `{"error": "...", "code": "..."}`.

## What gets extracted

Only **public** profile metadata. Never downloads images/videos. The worker
calls this script once per username to be analyzed.
