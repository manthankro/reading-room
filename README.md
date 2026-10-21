![Pramanix logo](public/pramanix-logo.jpg)

# Reading Room

A calm, private shelf for short reading: stories, essays, poems, letters, comics, and interactive adventures.

Browse a catalogue of public-domain classics and original works. Your reading progress, bookmarks, highlights, and notes stay in your browser by default. Sign in only when you want to sync your shelf across devices.

## Features

- Search and filter by genre, form, author, period, and reading time
- Illustrated editorial story cards with distinct locally rendered cover art and optional persistent cover-image URLs
- Mood-led genre browsing, including mystery, myths, romance, quiet reading, and adventure
- A Daily Escape feature with a stable daily story, cover art, teaser, and direct reading action
- Story detail cover art, language metadata, passage navigation, and a distraction-free reader mode
- Curated collections and a “Surprise me” option
- Reader themes and controls for type size, line spacing, and reading width
- Local bookmarks, highlights, margin notes, daily goals, and backup/restore
- Optional account sync
- Installable PWA with share cards and an install guide

## Run locally

**Requirements:** Node.js 22 or later and npm.

```sh
git clone https://github.com/manthankro/reading-room.git
cd reading-room
npm ci
npm run dev
```

Open the address printed by Vite. The development server uses port 8080.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run the test suite |
| `npm run build` | Build the production app and apply configured migrations |
| `npm run preview` | Preview a production build |

## Visual reading experience

Reading Room creates deterministic, story-specific SVG cover illustrations locally from each work’s slug and thematic metadata. The same cover component is reused in the daily feature, catalogue cards, and reader detail page. Works can optionally define a `coverImage` URL in their catalogue data to use a persistent hosted cover instead. Existing works default to English unless a `language` value is supplied. Covers remain outside the reading text so focus mode stays uncluttered. The catalogue is currently code-managed; a database-backed cover upload/admin interface is not part of this release.

## How it works

Reading Room is a full-stack React application built with TanStack Start and Vite. TanStack Router handles file-based routes; Nitro packages the server for Vercel.

The catalogue is stored in TypeScript modules under `src/lib/`. Reading data is local-first and uses the browser by default. When sign-in and a database are configured, Better Auth protects account features and Postgres stores the signed-in reader’s synced shelf. Builds without a database skip the deploy-time migration step; local preview can use PGLite.

## Configuration

Most readers can use the app without environment variables. To enable deployed sign-in and cross-device sync, configure the Better Auth provider credentials and a Postgres `DATABASE_URL` in the deployment environment. Keep secrets server-side and out of the repository.

The app can also receive `VITE_*` settings at build time. Only use that prefix for values that are safe to expose to the browser.

## Quality checks and CI

GitHub Actions runs on pushes and pull requests targeting `main`. It installs from the lockfile and runs:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`

Run the same checks locally before opening a pull request.

## Project structure

```text
.github/workflows/  CI workflow
migrations/         SQL migrations
public/             Static assets, PWA art, and share-card images
scripts/            Build helpers, migrations, and unit tests
server/             Nitro middleware
src/components/     Library and reader interface
src/lib/            Catalogue, reading state, auth, and database helpers
src/routes/         TanStack file-based routes
```

## Catalogue and content

The catalogue combines public-domain works with original Reading Room pieces. Each work includes its source and provenance information where applicable. The code is licensed under MIT; individual texts, illustrations, and other media may have separate rights and reuse terms. Check the attribution and provenance supplied with an item before reusing its content.

## Contributing

1. Create a branch for your change.
2. Make the change and add or update tests when behavior changes.
3. Run lint, typecheck, tests, and the production build.
4. Open a pull request with a short description and any relevant screenshots.

Please avoid committing secrets, local environment files, or generated build output.

## License

The application code is released under the [MIT License](LICENSE), copyright Manthan Lonkar. Catalogue texts and media may have separate terms as described above.
