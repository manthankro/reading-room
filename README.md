# Reading Room

A private shelf for short reading: comedy, romance, love stories, horror, action, adventure, comics, poems, essays, and letters.

Pick up where you left off, turn a comic panel by panel, or steer an interactive crossing yourself. Reading data stays in the browser unless you choose to sign in and sync it across devices.

---

## Table of contents

- [Features](#features)
- [Architecture overview](#architecture-overview)
- [Tech stack](#tech-stack)
- [High-level data flow](#high-level-data-flow)
- [Project layout](#project-layout)
- [Catalogue model](#catalogue-model)
- [Reading state & sync](#reading-state--sync)
- [Auth](#auth)
- [Database & migrations](#database--migrations)
- [PWA, install & share cards](#pwa-install--share-cards)
- [Build pipeline & plugins](#build-pipeline--plugins)
- [Run locally](#run-locally)
- [Quality checks & CI](#quality-checks--ci)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [License](#license)

---

## Features

- **Catalogue** — public-domain classics plus original short works written for Reading Room
- **Forms** — stories, essays, poems, letters, comics (panel-by-panel), and interactive adventures
- **Genres** — comedy, emotional, romance, love, action, adventure, horror, poetry, essay, letter
- **Discovery** — typo-tolerant search; filters by genre, form, author, period, and reading time; Work of the day; Surprise me; curated collections
- **Reader** — lamp / day / night themes; adjustable type size, line spacing, and measure; bookmarks, passage highlights, margin notes
- **Progress** — daily reading goal; shelf backup and restore; optional account sync across devices
- **Installable** — PWA manifest, install tutorial (`?install=1`), and share-card / Open Graph metadata

---

## Architecture overview

Reading Room is a **TanStack Start** full-stack React app. The UI is a single-page experience with file-based routes. Server concerns (auth API, optional Postgres, Nitro middleware for PWA) run on the same deployment target (Vercel).

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
│  library-screen ──► reader-screen ──► reading-store (local)     │
│       │                    │                    │               │
│       └──────── TanStack Router / Query ────────┘               │
└────────────────────────────┬────────────────────────────────────┘
                             │ same-origin /api/*
┌────────────────────────────▼────────────────────────────────────┐
│                    Nitro (Vercel serverless)                    │
│  /api/auth/* (Better Auth)   reading-sync server fns            │
│  server/middleware/grok-pwa  (manifest, install, OG head tags)  │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     DATABASE_URL set?              No (preview / local)
     Neon Postgres                  PGLite (WASM Postgres)
```

**Design principles**

1. **Catalogue is static source** — works live in TypeScript modules; no DB required to browse or read.
2. **Local-first reading state** — bookmarks, highlights, progress, and notes live in the browser by default.
3. **Opt-in sync** — signed-in users can push/pull their shelf to a per-user row in Postgres.
4. **Platform chrome is shared** — PWA head tags, install page, and OG identity are injected by Vite (dev) and Nitro middleware (deploy), not hard-coded in React routes.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, Tailwind CSS v4, Radix primitives, Lucide icons |
| Routing / SSR | TanStack Start + TanStack Router (file-based routes) |
| Client state | Zustand (`reading-store`), TanStack Query |
| Auth | Better Auth (OAuth / session), same-origin `/api/auth/*` |
| Database | Postgres via `pg` when `DATABASE_URL` is set; otherwise **PGLite** (Postgres in WASM) for preview |
| SQL toolkit | Kysely |
| Bundler / server | Vite 8, Nitro 3 (Vercel preset) |
| Validation | Zod |
| Language | TypeScript (strict), ESM throughout |

Node.js **22+** is required.

---

## High-level data flow

### Browsing & reading (no account)

1. `src/lib/works.ts` + `src/lib/works-original.ts` define the catalogue.
2. `src/lib/library.ts` merges them, exposes search, shelves, genres, and collections.
3. `library-screen.tsx` lists and filters; navigation goes to `/read/$slug`.
4. `reader-screen.tsx` renders paragraphs, comic panels, or adventure nodes.
5. Progress, bookmarks, highlights, and notes write to **Zustand + localStorage** via `reading-store`.

### Optional sync (signed in)

1. User signs in through Better Auth (preview uses a popup + bearer token; deploy uses HttpOnly cookies).
2. `reading-sync` server functions load/save a JSON blob scoped to the verified `userId`.
3. Client merges remote and local state; conflicts prefer the newer timestamp.

### Auth session differences

| Environment | Session transport | Sign-out |
| --- | --- | --- |
| Live preview (iframe) | Bearer token in `sessionStorage` | Clear token immediately; server call is best-effort |
| Deployed | HttpOnly cookie | Must wait for successful server sign-out |

Logic lives in `scripts/sign-out-plan.mjs` and is used by `src/lib/auth/client.ts` so preview and deploy stay consistent.

---

## Project layout

```text
.
├── .github/workflows/ci.yml     # lint → typecheck → test → build
├── migrations/                  # SQL applied on deploy (and by PGLite in preview)
│   ├── 0001_auth.sql
│   ├── 0002_reading_sync.sql
│   └── auth/                    # reference copy; not auto-applied until copied up
├── public/                      # static assets, favicon, og.jpg, PWA install art
├── scripts/                     # build helpers, PWA plugin, tests, migrate
│   ├── grok-pwa-plugin.mjs      # Vite: virtual OG identity, install page, head inject
│   ├── grok-pwa-shared.mjs      # shared PWA/OG helpers (Vite + Nitro)
│   ├── migrate.mjs              # applies pending SQL migrations
│   ├── migration-plan.mjs       # pure helpers: pendingMigrations, sort, names
│   ├── sign-out-plan.mjs        # pure sign-out / pre-sign-in sequence
│   └── with-app-env.mjs         # injects VITE_* from .grok/app-env.json
├── server/
│   └── middleware/grok-pwa.ts   # Nitro: manifest, ?install=1, streaming OG/PWA head
├── src/
│   ├── components/
│   │   ├── library-screen.tsx   # shelf UI, filters, collections
│   │   ├── reader-screen.tsx    # reader, comics, adventure choices
│   │   ├── reading-sync.tsx     # client sync orchestration
│   │   └── …
│   ├── lib/
│   │   ├── works.ts             # public-domain catalogue + Work types
│   │   ├── works-original.ts    # original Reading Room works
│   │   ├── library.ts           # search, shelves, genres, collections
│   │   ├── reading-store.ts     # local shelf (Zustand)
│   │   ├── reading-sync.ts      # server-backed sync for signed-in users
│   │   ├── db.ts                # Neon or PGLite Sql surface
│   │   ├── auth/                # Better Auth client + server helpers
│   │   ├── app-data/            # connector readiness probes (platform)
│   │   └── og/site.json         # share-card identity (title, image, color)
│   ├── routes/                  # TanStack file routes (__root, index, read/$slug, …)
│   ├── router.tsx
│   └── styles.css
├── vite.config.ts               # plugins: PWA, auth popup, PGLite bootstrap, Nitro
├── package.json
└── AGENTS.md                    # App Builder sandbox contract (agents only)
```

---

## Catalogue model

Core type (simplified):

```ts
type Shelf = "story" | "essay" | "poem" | "letter" | "comic";

type Work = {
  slug: string;
  title: string;
  author: string;
  year: number;
  shelf: Shelf;
  paragraphs: string[];
  // optional extensions in full catalogue:
  // genres, comic panels, adventure graph, provenance, original flag, …
};
```

- **`src/lib/works.ts`** — classic / public-domain volumes
- **`src/lib/works-original.ts`** — original pieces written for this app
- **`src/lib/library.ts`** — merges both lists; implements `matchesSearch`, shelf labels, genre catalog, curated collections (`quick`, `heart`, `after-dark`, …)

The full classic + original catalogues are large TypeScript modules. A minimal stub may be present on `main` if a full sync was size-limited; replace `works.ts` / `works-original.ts` from the complete workspace package for the full shelf.

---

## Reading state & sync

| Concern | Module | Storage |
| --- | --- | --- |
| Local shelf (progress, bookmarks, highlights, notes, goal) | `reading-store.ts` | Browser (Zustand + persistence) |
| Backup / restore file | same | Downloadable JSON |
| Cloud sync | `reading-sync.ts` + server functions | Postgres row per user |

Sync is **off** until the user signs in. Without auth, the app never touches the database for reading data.

---

## Auth

- **Library**: [Better Auth](https://www.better-auth.com/)
- **Routes**: `/api/auth/*` (catch-all), optional `/login`
- **Preview**: OAuth completes in a popup; session is a bearer token (partitioned iframe cannot rely on cookies)
- **Deploy**: full-page OAuth; session cookie is HttpOnly
- **Popup handler**: served by the Vite `authPopupPlugin` in `vite.config.ts` — do not add a React route at `/auth/popup`

Shared pure logic for timeouts and outcomes: `scripts/sign-out-plan.mjs`.

---

## Database & migrations

| Mode | When | Backend |
| --- | --- | --- |
| Production / configured sandbox | `DATABASE_URL` set | Neon (or any Postgres) via `pg` |
| Local preview without URL | no `DATABASE_URL` | **PGLite** — Postgres compiled to WASM |

Migrations live under `migrations/*.sql` (non-recursive). Shared bookkeeping:

- `scripts/migration-plan.mjs` — `pendingMigrations`, `migrationName`, `isMigrationFile`, `sortMigrationFiles`
- `scripts/migrate.mjs` — applies pending files on `npm run build` / `npm run db:migrate`
- `src/lib/db.ts` — same plan for PGLite bootstrap via `import.meta.glob`

Applied files are keyed by **basename**, so copying `migrations/auth/0001_auth.sql` up to `migrations/` does not re-run on a DB that already has it.

---

## PWA, install & share cards

| Concern | Dev (Vite) | Deploy (Nitro) |
| --- | --- | --- |
| Web manifest | `grokPwaPlugin` | `server/middleware/grok-pwa.ts` |
| Install tutorial (`?install=1`) | same | same |
| Inject PWA + OG meta before `</head>` | transform / stream wrap | streaming `TransformStream` |
| OG identity at build | virtual module `virtual:grok-og-identity` | baked from snapshot |

Shared implementation: `scripts/grok-pwa-shared.mjs`  
Site identity for cards: `src/lib/og/site.json` + `public/og.jpg`  
Brand gate used by smoke tests: `scripts/brand-check.mjs`

---

## Build pipeline & plugins

`vite.config.ts` wires (order matters):

1. **pgliteBootstrapPlugin** — warm PGLite + migrations before first request in dev
2. **authPopupPlugin** — `/auth/popup` before TanStack Start
3. **appEnvPlugin** — expose `VITE_*` for invariant checks
4. **grokPwaPlugin** — manifest, install page, head injection, `virtual:grok-og-identity`
5. **Tailwind v4**, **TanStack Start**, **React**
6. **Nitro** (build / preview only) — Vercel preset, `serverDir: "./server"` so middleware registers

Scripts are wrapped with `node scripts/with-app-env.mjs` so `.grok/app-env.json` reaches Vite consistently.

---

## Run locally

```sh
npm ci
npm run dev
```

Dev server binds **`0.0.0.0:8080`**. Open the URL printed by Vite.

Other useful commands:

```sh
npm run build          # production build + migrate
npm run preview        # serve built output
npm run db:migrate     # apply SQL only
npm run typecheck
npm run lint
npm test
```

---

## Quality checks & CI

GitHub Actions (`.github/workflows/ci.yml`) on every push and PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test` — Node test runner on `scripts/**/*.test.mjs` and selected `src/lib/**/*.test.ts`
5. `npm run build`

Local browser smoke (when Playwright is available):

```sh
node scripts/browser-smoke.mjs
```

---

## Deployment

Configured for **Vercel** via Nitro’s `vercel` preset.

1. Import the repository in Vercel (default build settings are fine).
2. Set production secrets in the host environment — never commit them.
3. For account sync: provide a durable Postgres `DATABASE_URL` and Better Auth provider credentials.
4. The static catalogue does not need a database; only auth + reading sync do.

---

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | server | Postgres connection; if unset, PGLite is used |
| Better Auth secrets / OAuth client IDs | server | Sign-in providers |
| `VITE_*` | client | Only variables with this prefix are exposed to the browser |
| `GROK_PROJECT_ID` / extensions flags | platform | Grok App Builder chrome |

Do not commit `.env` files. Platform deploy injects production secrets.

---

## License

Application code is released under the **MIT License** (see `LICENSE`).

Public-domain texts and original Reading Room pieces have different terms: originals may be read in this app; check the provenance line on each volume before reusing a text elsewhere.
