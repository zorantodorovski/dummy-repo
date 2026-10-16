# Architecture

This repository is a pnpm monorepo that pairs a cross-platform client with a
headless content management system. The client renders dynamic landing-page
content that is authored and stored in the CMS, so content can change without
redeploying the app.

## Workspace layout

The repository is managed as a pnpm workspace (`pnpm-workspace.yaml`) with
Turborepo (`turbo.json`) orchestrating build order. The workspace declares two
package globs:

- `apps/*` — deployable applications
- `packages/*` — internal libraries and shared configuration

```
apps/
  app/     Expo (React Native) client application
  cms/     Payload CMS backend + Next.js frontend
packages/
  shared/            @repo/shared — shared types, utils, and UI components
  typescript-config/ Shared TypeScript compiler options
```

## Applications

### `apps/app` — Expo client

A React Native application built with Expo (SDK 57) and expo-router. It runs on
iOS, Android, and Web (`app.json` declares all three platforms; Web uses Metro).

- `app/_layout.tsx` declares the root navigation stack via expo-router.
- `app/index.tsx` is the home screen. On mount it fetches
  `${EXPO_PUBLIC_CMS_URL}/api/globals/landing-page` and renders the result with
  the shared `LandingPage` component, showing a spinner while loading and an
  error message on failure. `EXPO_PUBLIC_CMS_URL` is exposed at build time via
  the `EXPO_PUBLIC_` env prefix (see `.env.example`); it defaults to
  `http://localhost:3001`.
- `metro.config.js` widens Metro's watch folders and `node_modules` resolution
  to the workspace root so the workspace-local `@repo/shared` package resolves
  correctly.
- Because `@repo/shared` is consumed as compiled output (see below), the app's
  lifecycle scripts (`prestart`, `predev`, `preios`, `preandroid`, `preweb`)
  run `pnpm --filter @repo/shared build` first.

### `apps/cms` — Payload CMS

A Payload 3 CMS hosted inside Next.js (App Router). It owns content authoring,
authentication, the REST API, and a small marketing homepage.

- `payload.config.ts` is the single source of truth for the CMS: it registers
  the `Users` and `Posts` collections, the `LandingPage` global, and the
  Postgres adapter (`@payloadcms/db-postgres`) using `DATABASE_URL`. It sets the
  admin user to `Users`, points generated types at `payload-types.ts`, and runs
  `seedLandingPage` in `onInit` to populate default landing-page content if none
  exists yet.
- `src/collections/` holds the content models. `Users` is the auth collection;
  `Posts` carries a `title` and a `draft`/`published` status (typing the status
  with `ContentStatus` from the shared package).
- `src/globals/LandingPage.ts` defines the `landing-page` global — the content
  the client fetches — with a `title`, a `hero` group (heading, subheading,
  call-to-action), and an array of `features`. Its `read` access is public, so
  the client can fetch it unauthenticated.
- `src/seed.ts` seeds that global once on first boot.
- `src/app/` is split into two route groups:
  - `(payload)/` — the Payload surface. `api/[...slug]/route.ts` wires the REST
    routes (GET/POST/PATCH/PUT/DELETE/OPTIONS) to the config, while `layout.tsx`,
    `serverFunction.ts`, and `admin/` provide the admin UI and server functions.
  - `(frontend)/` — the Next.js marketing site (`page.tsx` renders a greeting
    using the shared `formatGreeting` helper and `AppMetadata` type).
- `next.config.ts` wraps the config with `withPayload` and adds
  `@repo/shared` to `transpilePackages` so the workspace dependency is
  transpiled by Next.

## Shared package

`packages/shared` (`@repo/shared`) is a private TypeScript library shared by
both applications. It compiles with `tsc` into `dist/` (ESM, with type
declarations) and exposes subpath entrypoints via its `package.json`
`exports` map:

- `.` — re-exports everything (`types`, `utils`, `ui`)
- `./types` — `LandingPageData`, `LandingPageFeature`, `AppMetadata`,
  `ContentStatus`
- `./utils` — `formatGreeting`, `slugify`
- `./ui` — `Button` and `LandingPage` React Native components

This package is the contract between CMS and client: the `LandingPageData` type
mirrors the `LandingPage` global schema, so the CMS output and the client
rendering stay in sync. It declares `react` and `react-native` as peer
dependencies and keeps its own copies in `devDependencies` for building and
type-checking.

## TypeScript configuration

`packages/typescript-config` holds shared `tsconfig` fragments that each app
extends:

- `base.json` — common strict ES2022/Bundler settings and `react-jsx`.
- `nextjs.json` — Next.js-specific options (no emit, `next` plugin, `.next`
  types). Extended by `apps/cms`.
- `expo.json` — Expo-specific options (no emit, platform `moduleSuffixes`).
  Extended by `apps/app`.

`packages/shared` extends `base.json` directly, adding `declaration` and an
`outDir` so it emits compiled artifacts.

## Data flow

1. An editor signs in to the CMS admin (`/admin`, port 3001) and edits the
   `landing-page` global (or `posts`).
2. The CMS persists it to PostgreSQL via the Postgres adapter.
3. The Expo app fetches
   `${EXPO_PUBLIC_CMS_URL}/api/globals/landing-page` (public read access).
4. The app renders the response through the shared `LandingPage` component,
   typed by `LandingPageData`.

## Dependency and build graph

Turborepo orders the work so shared code is built before its consumers:

- `build` depends on upstream `^build` and caches `.next`, `dist`, and `web-build`.
- `dev` is a persistent task with caching disabled, also running after upstream
  `^build`.
- `lint` and `typecheck` run after upstream `^build`/`^lint`.

Consumers additionally rebuild `@repo/shared` in their own pre-scripts so a
standalone `pnpm --filter <app> dev` works without a full workspace build.

## Tooling and scripts

Root `package.json` scripts delegate to the apps and Turborepo:

- `pnpm dev` — start both apps via `turbo run dev`.
- `pnpm build` — build the whole workspace.
- `pnpm lint` / `pnpm typecheck` — validate all packages.
- `pnpm app:*` / `pnpm cms:*` — run a single app.

Linting uses a flat ESLint 9 config (`eslint.config.mjs`) built on
`eslint-config-expo`, with ignores for build outputs and generated files.

## Deployment with Docker Compose

`docker-compose.yml` runs the full stack from a single multi-app image:

- A single `Dockerfile` builds the workspace once (`pnpm install` +
  `@repo/shared` build), then uses a build arg `APP` to decide whether to run
  the Expo web app (`app`, port 8081) or the CMS (`cms`, port 3001).
- A `postgres:17-alpine` service backs the CMS, with a health check that gates
  the CMS via `depends_on: condition: service_healthy`. Data persists in the
  `postgres_data` volume.
- `cms` receives `DATABASE_URL` (pointing at the `db` service) and
  `PAYLOAD_SECRET` from the environment, with development defaults and
  overridable values for `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`,
  `PAYLOAD_SECRET`, and the exposed `APP_PORT`/`CMS_PORT`/`POSTGRES_PORT`.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_CMS_URL` | `apps/app` | Base URL of the CMS REST API; build-time public value. |
| `DATABASE_URL` | `apps/cms` | Postgres connection string for the Payload adapter. |
| `PAYLOAD_SECRET` | `apps/cms` | Payload secret used for signing tokens/sessions. |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Compose | Postgres credentials and database name (compose defaults). |
| `APP_PORT` / `CMS_PORT` / `POSTGRES_PORT` | Compose | Host port overrides (defaults 8081 / 3001 / 5432). |

`.env.example` files in each app document the per-app variables; local `.env`
files are git-ignored.
