# Dummy Repo

This pnpm workspace contains an Expo app (`apps/app`), a Payload CMS app
(`apps/cms`), and the shared `@repo/shared` package.

## Getting started

Install pnpm 10 and Node.js 20.19 or newer, then run `pnpm install`.

Start the Expo app with `pnpm --filter app web` (or `pnpm --filter app ios` /
`pnpm --filter app android`). To start the CMS, configure its PostgreSQL
connection and Payload secret in `apps/cms/.env` using
`apps/cms/.env.example` as a template, then run `pnpm --filter cms dev`.

Run `pnpm dev` to start both applications, `pnpm build` to build them, or
`pnpm lint` / `pnpm typecheck` to validate the workspace.