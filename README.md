# Reading Room

A private shelf for short reading: comedy, romance, love stories, horror, action, adventure, comics, poems, essays, and letters. Pick up where you left off, turn a comic panel by panel, or steer a crossing yourself. Reading data stays in your browser unless you choose to sign in and sync it across devices.

## What’s inside

- The original public-domain shelf, plus original short works written for Reading Room.
- Genres: comedy, emotional, romance, love stories, comics, action, adventures, horror, poems, essays, and letters.
- An interactive adventure, The Lantern Ferry, with choices and more than one ending.
- Comics you turn with buttons or the arrow keys.
- Typo-tolerant search, plus filters for genre, form, author, period, and reading time.
- Work of the day, Surprise me, and reading paths for short pauses, matters of the heart, after dark, comedy, action, and the older shelf.
- A focused reader with lamp, day, and night themes; adjustable type size, line spacing, and measure.
- Bookmarks, passage highlights, margin notes, a daily reading goal, and a shelf backup you can restore.
- Optional account sync. Without signing in, reading data remains in local browser storage.

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

The project is configured for Vercel. Import this repository and use the detected build settings. Do not commit secrets. For production account sync, configure the hosting environment's auth provider credentials and a durable Postgres `DATABASE_URL`. The catalogue itself is static source and does not need a database.

## Project layout

- `src/components/` contains the library and reader experiences.
- `src/lib/works.ts` contains the public-domain catalogue.
- `src/lib/works-original.ts` contains original stories, comics, poems, essays, and letters.
- `src/lib/reading-store.ts` manages the local shelf and portable backups.
- `src/lib/reading-sync.ts` securely syncs each signed-in reader's data to their own account row.
- `scripts/` contains project checks and build helpers.

## License

The application code is released under the MIT License. Public-domain texts and the original Reading Room pieces have different terms: originals may be read in this app; check the provenance line on each volume before reusing a text elsewhere.
