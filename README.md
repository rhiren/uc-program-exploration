# UC Pathways Explorer

A local-first undergraduate program, career, medicine, and UC preparation
explorer for a student entering 11th grade.

The product has two equal paths:

- **Discover:** understand programs, careers, and the work behind them.
- **Prepare:** review UC requirements and build a realistic 11th–12th grade
  preparation plan.

The site is exploratory, not predictive. It must never calculate an admission
probability or decide whether a student is suited to a career.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run validate:content
npm run dev
```

Useful checks:

```bash
npm run build
npm test
npm run lint
```

## Publish with GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Every push to
`main` validates the content, checks the code, creates a static Next.js export,
and publishes it through GitHub Pages.

Before the first deployment, open the repository on GitHub and select:

`Settings → Pages → Build and deployment → Source: GitHub Actions`

The expected project-site address is:

`https://rhiren.github.io/uc-program-exploration/`

To verify the same static export locally:

```bash
PAGES_BASE_PATH=/uc-program-exploration npm run build:pages
PAGES_BASE_PATH=/uc-program-exploration npm run validate:pages
```

GitHub Pages is a static host. Keep student progress in browser storage and do
not add server actions, runtime databases, or private server-side data to the
Pages build.

## Authoritative project files

- `docs/UC_PATHWAYS_EXPLORER_BUILD_PLAN.md` — product and engineering plan,
  version 2.2
- `content/manifest.json` — machine-readable content package inventory
- `content/**/*.json` — authoritative version 1 editorial content
- `lib/content/load-content.ts` — centralized application content loader
- `lib/content/validate-content.ts` — runtime/build-time schema and
  cross-reference validation
- `scripts/validate/validate-content.mjs` — standalone package-integrity check

The top-level `uc-pathways-content-v1.0.0/` and
`uc-pathways-precode-handoff-v2.2/` directories are preserved transfer copies.
They are intentionally ignored by Git and must not be imported by application
code.

## Content rules

1. Read content through `lib/content/load-content.ts`; components must not
   import individual JSON records.
2. Edit the canonical JSON files under `content/`.
3. Preserve stable IDs, source references, versions, verification dates, review
   dates, and maintenance ownership.
4. Run `npm run validate:content`, `npm test`, and `npm run lint` after changes.
5. Do not run `scripts/content/generate-v1-content.mjs` automatically. It is a
   bootstrap/provenance tool and can overwrite direct JSON edits.
6. No institutional or labor-data APIs are required at browser runtime.

## Current implementation

- Product home page
- Discover overview with 13 interest gateways, 9 detailed program guides, and
  a searchable Fall 2026 official UC directory snapshot containing 634 named
  majors across 920 campus-major entries
- Guided Discover journey with four questions, a genetics sampler, reflection,
  and a diverse three-path reveal
- Versioned device-local progress with export, import, and reset
- Prepare overview with A–G and comprehensive-review guidance
- Medicine overview with premed guidance, training timeline, and three
  challenge introductions; the genetics activity is interactive
- Manifest-first content loading and validation
- Local-first responsive visual foundation

The next planned slice is the matching interactive Prepare journey: a
lightweight academic baseline, A–G and UC GPA review, a partial UC Readiness
Snapshot, and at most three next actions.
