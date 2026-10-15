FROM node:24-bookworm-slim

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

COPY . .

RUN pnpm install --frozen-lockfile \
  && pnpm --filter @repo/shared build

ARG APP
ENV APP=${APP}

EXPOSE 3001 8081

CMD ["sh", "-c", "if [ \"$APP\" = app ]; then exec pnpm --filter app web -- --host lan; elif [ \"$APP\" = cms ]; then exec pnpm --filter cms dev --hostname 0.0.0.0; else echo 'Set APP to app or cms'; exit 1; fi"]
