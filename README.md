# Insta Lovon

> Independent Instagram analytics platform. Built on **Instaloader**, **Crawlee**, **Playwright**, and **Gemini AI**.

Paste a public Instagram profile URL, get a structured report in seconds — strengths,
weaknesses, recommended actions. No API quota, no Meta approval process, fully open architecture.

> ⚠️ **Legal notice.** Insta Lovon operates on **public** profile data only. We never
> require Instagram credentials and never download media. By using the platform you agree
> to our [Legal & ToS](apps/web/src/app/(public)/legal/page.tsx) and our [Terms](apps/web/src/app/(public)/terms/page.tsx).
> Operators and end users are responsible for ensuring their use complies with Instagram's
> Terms of Service and applicable law.

---

## Architecture

```
                 ┌───────────────────────┐
                 │  Next.js 15 Web (Vercel) │
                 │  Auth, Dashboard, API   │
                 └──────────┬────────────┘
                            │ HTTP / cookies
                            ▼
                 ┌───────────────────────┐
                 │  Postgres (Neon, etc) │
                 └──────────┬────────────┘
                            │ polling (SELECT FOR UPDATE SKIP LOCKED)
                            ▼
                 ┌────────────────────────────────────────────┐
                 │  Worker (Railway / Fly.io / Docker)        │
                 │  • Crawlee (queue / proxy orchestration)   │
                 │  • Playwright (browser flows when needed)  │
                 │  • Instaloader sidecar (Python)            │
                 │  • Gemini (with optional Headroom wrap)    │
                 └────────────────────────────────────────────┘
```

### Stack

| Layer | Tech | License |
| --- | --- | --- |
| Web app | Next.js 15 + Tailwind CSS | MIT |
| DB | Prisma + Postgres | Apache 2.0 / MIT |
| Auth | `jose` (JWT) + `bcryptjs` | MIT |
| Worker | Crawlee + Playwright + Node 22 | Apache 2.0 |
| Extract | Instaloader (Python) | MIT |
| AI | Gemini 2.5 Flash | Commercial |

---

## Repository layout

```
instalovon/
├── apps/
│   ├── web/              # Next.js 15 dashboard + API
│   └── worker/           # Long-running worker (Node)
├── packages/
│   ├── db/               # Prisma schema + client
│   ├── ai/               # Gemini wrapper (with optional Headroom)
│   └── shared/           # Shared TS types & Zod schemas
├── services/
│   └── instaloader/      # Python sidecar (subprocess from the worker)
├── infra/
│   ├── Dockerfile.worker # Container image for the worker
│   └── railway.json      # Railway service manifest
└── vercel.json           # Vercel project config (Next.js)
```

---

## Quickstart (local)

### 0. Prerequisites

* Node.js 22+
* Python 3.11+ with `pip`
* A Postgres database (Neon free tier works)

### 1. Clone & install

```bash
git clone https://github.com/fjosmoreno/instalovon
cd instalovon
npm install
```

### 2. Configure env

```bash
cp .env.example .env
# Edit .env with:
#   DATABASE_URL from Neon (or local Postgres)
#   AUTH_SECRET (openssl rand -hex 32)
#   GEMINI_API_KEY from https://aistudio.google.com/apikey
```

### 3. Set up the DB

```bash
# Generate Prisma client & apply schema
npm run db:generate
npm run db:migrate
```

### 4. Install the Python sidecar

```bash
pip install -r services/instaloader/requirements.txt
```

### 5. Run

Two terminals:

```bash
# Terminal 1 — web (http://localhost:3000)
npm run web:dev

# Terminal 2 — worker (polls Postgres every 5s)
npm run worker:start
```

Open http://localhost:3000, sign up, paste `@instagram` or any other public profile.

---

## Deployment

| Piece | Recommended host | Why |
| --- | --- | --- |
| `apps/web` | **Vercel** | First-class Next.js, serverless functions included |
| `apps/worker` | **Railway** (Dockerfile) | Long-running process with persistent Python env |
| Postgres | **Neon** (free tier works) | Serverless Postgres, great DX |

### Deploy to Vercel

```bash
npx vercel link
npx vercel env add DATABASE_URL production
npx vercel env add AUTH_SECRET production
npx vercel env add GEMINI_API_KEY production
# Optional: HEADROOM_ENABLED with value 1
npx vercel deploy --prod
```

### Deploy the worker to Railway

```bash
# In Railway dashboard: new project → "Deploy from GitHub repo"
# Set root path to repo, configure dockerfile path to infra/Dockerfile.worker
# Add env: DATABASE_URL, GEMINI_API_KEY, INSTALOADER_TIMEOUT_MS, etc.
```

The worker will run `node apps/worker/dist/index.js` and start polling jobs.

---

## How data flows

1. User signs up & signs in (JWT cookie).
2. User submits a public Instagram username or URL → `POST /api/jobs` creates a `Job` row
   with status `pending`.
3. The worker's polling loop picks the row (`SELECT ... FOR UPDATE SKIP LOCKED`), flips
   it to `running`, and spawns the Instaloader subprocess per username.
4. Snapshots (public metadata only: followers, bio, recent posts, hashtags) are cached
   in the `ProfileCache` table for 6 hours.
5. The collected snapshots are sent to Gemini with a strict JSON schema prompt.
6. The job is marked `succeeded` with `profileData` (snapshots) and `report` (AI report).
7. The user refreshes `/jobs/[id]`; the UI auto-polls until the job is terminal.

---

## What is and is not allowed

**Allowed**
* Analyzing public profiles (your brand, your clients' accounts, market research).
* Caching metadata for 6 hours.
* Adding optional Headroom compression to cut Gemini input costs.

**Not allowed**
* Submitting private profiles (the worker returns a clear error).
* Logging in to Instagram with user credentials (we never have them).
* Downloading media (Instaloader is configured with all `download_*` flags off).
* Using the platform for harassment, stalking, or copyright infringement.

See [`apps/web/src/app/(public)/legal/page.tsx`](apps/web/src/app/(public)/legal/page.tsx) for the full legal notice.

---

## Roadmap

* [ ] Comparison view (analyse multiple profiles side-by-side)
* [ ] Crawlee + Playwright flows: hashtag trends, public story snapshots, mention crawling
* [ ] Paid proxy provider integration (Bright Data / SmartProxy / Oxylabs)
* [ ] BullMQ + Redis for distributed workers
* [ ] Email + Slack notifications when jobs complete
* [ ] PDF report export

---

## Development

```bash
npm run typecheck      # typecheck all workspaces
npm run lint           # lint all workspaces
npm run build          # build all workspaces
```

---

## License

MIT © 2026 Fernando Moreno (`fjosmoreno`). See [`LICENSE`](LICENSE).
