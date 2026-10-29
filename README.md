# Robert Leszczyński — portfolio

A project-first portfolio for AI reliability and automation work. Next.js (App Router), TypeScript, Tailwind CSS v4. Every page exists in English (`/en`) and Polish (`/pl`).

## Run

Requires Node.js ≥ 20.9 and pnpm.

```sh
pnpm install
pnpm dev                  # http://localhost:3000 → redirects to /en
```

## Verify

```sh
pnpm typecheck
pnpm lint
pnpm test                 # content integrity, style rules and snippet checks (Vitest)
pnpm build
pnpm exec playwright install chromium   # once
pnpm test:e2e             # runs against the production build on port 3210
```

`pnpm verify` runs all of them in order.

- `tests/content.test.ts` checks that every `{ en, pl }` pair is filled in both languages, that no project claims to be completed, that services and lab items link to projects that exist, that the test-run numbers are consistent and that failures are named, and that retired slogans stay retired.
- `tests/style.test.ts` scans `src/**/*.tsx` for the rules below that are easy to break in review: `uppercase` outside the EN/PL switch, `font-mono` outside code, captions and diagrams, `bg-accent` outside the primary button, `rounded-full`, `rounded-xl`, `shadow-`, `backdrop-blur`, letter-spaced labels, text under 14px, and colour names that no longer exist.
- `e2e/site.spec.ts` checks every route in both languages, the case-study structure, the language switch (path, query string and hash), the no-JS project filter, the mobile menu, the first viewport at 1440×900 and 390×844, and that no route scrolls sideways at 360, 390, 768, 1024 or 1440px.

The snippet test compares every code excerpt on the site with the Learning OS source. It runs when `LEARNING_OS_PATH` points at that repository and is skipped otherwise:

```sh
LEARNING_OS_PATH=/path/to/learning-os pnpm test
```

## Design decisions

**One light theme.** The dark theme was dropped: there is no toggle, no boot script, no `data-theme` attribute and no dark code theme, and the page declares `color-scheme: light`. The reasons:

- The only real imagery on the site is the Learning OS interface, which is light. On a dark page the screenshots would sit as glaring rectangles.
- Two themes would both have to be polished across two languages, five widths and every diagram, plate and code listing.
- A light, neutral page suits a portfolio that is read like documentation.

**Type.** Two web families, both loaded with `next/font` (latin and latin-ext, so every Polish glyph comes from its own family):

- **Newsreader** is the voice: the name, headings, statements and numerals (results, facts, project and part numbers). Optical size follows the font size.
- **Schibsted Grotesk** is the documentation: body text, navigation, metadata, captions and buttons.
- The system monospace stack is used only for code, inline code, literal paths and code identifiers in diagrams.

Nothing is uppercase except the EN/PL codes, nothing is letter-spaced as a label, and no content text is smaller than 14px (code listings excepted). `src/lib/typo.ts` adds non-breaking spaces so that Polish one-letter words never end a line, numbers stay with their units, no line starts with a dash and "Learning OS" never splits.

**Colour.** Tailwind's default palette is cleared in `src/app/globals.css`. Only the named tokens exist: paper, raised, stone and paper-dim surfaces, ink and ink-2 text, ink-3 for code comments and line numbers, line and line-strong hairlines, one ultramarine accent, and pass, fail and partial. The accent marks links, focus, the current item, figure and listing numbers, and the one emphasised node in a drawing. It is never a background at rest, and status is never shown by colour alone.

**Layout.** The `page-grid` utility in `globals.css` has 4 columns under 640px, 8 up to 1023px and 12 from 1024px, with named `full-start`/`full-end` lines for full-bleed plates. There are no boxed cards; hairlines separate blocks.

## Where things live

| Path | What |
| --- | --- |
| `src/content/profile.ts` | Name, contact channels, role and the hero statement |
| `src/content/projects/*.ts` | One file per case study (EN + PL side by side), including the status line and homepage notes |
| `src/content/evidence.ts` | Learning OS test-run numbers — update only by re-running the suites |
| `src/content/snippets.json` | Verbatim code excerpts; regenerate with `pnpm snippets` |
| `src/content/{lab,services,skills,background,education,principles}.ts` | Remaining page content |
| `src/content/diagrams.ts` | Labels, captions and the kind (architecture, method, concept, design) of every figure |
| `src/content/ui.ts` | Interface strings |
| `src/app/globals.css` | Colour tokens, type scale, page grid |
| `src/lib/typo.ts` | Non-breaking spaces for headings, paragraphs and captions |
| `src/components/diagrams/*` | Native React/SVG diagrams and typographic schematics |
| `src/app/[locale]/*` | Routes, all statically generated for `en` and `pl` |

Every user-visible string is a `{ en, pl }` pair; `tests/content.test.ts` fails if either side is missing.

## Configuration

- **Contact links** — fill `email`, `github`, `linkedin` and `cv` in `src/content/profile.ts`. Empty values hide the corresponding buttons, and the homepage contact band appears only once at least one channel is set.
- **Site URL** — set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) at build time for canonical URLs, OpenGraph and the sitemap.
- **Repositories** — set `repository` on a project only with a verified public URL.
- **Code snippets** — `LEARNING_OS_PATH=/path/to/learning-os pnpm snippets` re-copies the excerpts listed in `scripts/extract-snippets.mjs`.

## GitHub Pages deployment

Production: https://rothfick.github.io/en/ (Polish: /pl/).

`pnpm build` exports the site to `out/`, creates the root language redirect,
a bilingual 404 page and `.nojekyll`. Images are served as local assets.
`pnpm start` serves the export locally on port 3210; set PORT to override.
`pnpm verify` checks types, lint, unit tests, build and browser tests against
that static export. The GitHub Actions workflow publishes successful main
branch builds using GitHub Pages (Settings → Pages → GitHub Actions).

No server, secret API keys or paid domain is required.
