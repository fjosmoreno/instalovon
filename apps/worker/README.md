# @instalovon/worker

Long-running worker that pulls pending jobs from Postgres, extracts Instagram
profile metadata via the Python [Instaloader](../services/instaloader) sidecar
and produces AI reports using Gemini.

## Env

```
DATABASE_URL=postgres://...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash        # optional
INSTALOADER_PATH=python3             # python binary
INSTALOADER_SCRIPT=/abs/path/to/extract.py
INSTALOADER_TIMEOUT_MS=90000
MAX_POSTS_PER_PROFILE=12
RECENT_DAYS=30
WORKER_POLL_INTERVAL_MS=5000
WORKER_JOB_TIMEOUT_MS=300000
ENABLE_CRAWLER=0                      # set to 1 to allow Crawlee+Playwright hooks
ENABLE_FREE_PROXIES=0                 # set to 1 to load free public proxies
PROXY_LIST_URL=https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000
AI_ENABLED=1
LOG_LEVEL=info
```

## Run locally

```
cd ../../  # instalovon root
npm install
npm run worker:start
```

## Run with Docker

See [`infra/Dockerfile.worker`](../../infra/Dockerfile.worker).
