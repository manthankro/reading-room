# Reading Room

A calm place to read short stories, essays, poems, and letters. Pick up where you left off, adjust the page to suit you, and keep notes alongside the text. Reading data stays in your browser unless you choose to sign in and sync it across devices.

## What’s inside

- A growing shelf of 22 works across four collections: stories, essays, poems, and letters.
- Typo-tolerant search, plus filters for author, genre, period, reading time, and shelf.
- Curated reading paths for short pauses, poetry, and works across centuries.
- A focused reader with lamp, day, and night themes; adjustable type size, line spacing, and reading width.
- Bookmarks, passage highlights, margin notes, reading history, and a daily reading goal.
- Optional account sync. Without signing in, reading data remains in local browser storage. JSON backup and restore are available at any time.
- Responsive layouts and keyboard-accessible controls.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the address shown by the development server. Reading works offline in the browser. Account sync uses the app's Better Auth and Postgres integration; the hosting environment must provide its authentication credentials and a durable `DATABASE_URL` for production sync.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs these checks for every pull request and every push to `main`.

## Deployment

The project is configured for Vercel. Import this repository and use the detected build settings. For production account sync, configure the hosting environment's supported auth provider credentials and a durable Postgres `DATABASE_URL`; never commit these secrets.

## Project layout

- `src/components/` contains the library and reader experiences.
- `src/lib/works.ts` contains the reading catalogue.
- `src/lib/reading-store.ts` manages the local shelf and portable backups.
- `src/lib/reading-sync.ts` securely syncs each signed-in reader's data to their own account row.
- `scripts/` contains project checks and build helpers.

## License

The application code is released under the MIT License. Literary texts may have separate rights and source terms; check the provenance of each work before redistributing the catalogue in other territories.
