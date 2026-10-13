# Reading Room

A calm, private place to read short stories, essays, poems, and letters. Pick up where you left off, adjust the page to suit you, and keep notes alongside the text. Reading progress, notes, and time are stored in your browser on this device.

## What’s inside

- A growing shelf of 22 works across four collections: stories, essays, poems, and letters.
- Search by title, author, year, or opening line, with quick collection filters.
- A focused reader with lamp, day, and night themes; adjustable type size, line spacing, and reading width.
- Saved reading position, reading time, completion state, and private notes in local browser storage.
- Responsive layouts and keyboard-accessible controls.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the address shown by the development server. The app uses local browser storage and does not require a database or account.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs these checks for every pull request and every push to `main`.

## Deployment

The project is configured for Vercel. Import this repository and use the detected build settings. No database credentials or authentication secrets are required for the current app.

## Project layout

- `src/components/` contains the library and reader experiences.
- `src/lib/works.ts` contains the reading catalogue.
- `src/lib/reading-store.ts` persists each reader’s preferences and activity locally.
- `scripts/` contains project checks and build helpers.

## License

The application code is released under the MIT License. Literary texts may have separate rights and source terms; check the provenance of each work before redistributing the catalogue in other territories.
