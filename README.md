# Dummy Repo

This pnpm workspace contains an Expo app (`apps/app`), a Payload CMS app
(`apps/cms`), and the shared `@repo/shared` package.

## Getting started

Install pnpm 10 and Node.js 24 LTS, then run `pnpm install`.

Start the Expo app with `pnpm --filter app web` (or `pnpm --filter app ios` /
`pnpm --filter app android`). To start the CMS, configure its PostgreSQL
connection and Payload secret in `apps/cms/.env` using
`apps/cms/.env.example` as a template, then run `pnpm --filter cms dev`.

Run `pnpm dev` to start both applications, `pnpm build` to build them, or
`pnpm lint` / `pnpm typecheck` to validate the workspace.

## Docker Compose

Run `docker compose up --build` to start the Expo web app, Payload CMS, and
PostgreSQL together. Open the app at <http://localhost:8081> and the CMS at
<http://localhost:3001/admin>. The CMS connects to the `db` service and waits
for PostgreSQL's health check before starting. PostgreSQL data persists in the
`postgres_data` volume.

Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `PAYLOAD_SECRET`
in the environment before launching to override the development defaults.
Ports can be changed with `APP_PORT`, `CMS_PORT`, and `POSTGRES_PORT`.