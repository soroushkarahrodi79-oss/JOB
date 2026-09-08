# Generic Node + plain Docker portability (ADR-0008 constraint 2). No managed-platform runtime,
# no platform SDK, no foreign CDN in the critical path (fonts are self-hosted). This image is the
# build-and-run check that constraint 3 requires; it is exercised in CI, not by review.

# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="/pnpm:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:tokens
ENV NEXT_STANDALONE=1
RUN pnpm --filter @platform/web build

FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# The Next standalone bundle is self-contained; static assets and the self-hosted fonts sit
# alongside it. A standard PostgreSQL connection string (ADR-0008 c2) would arrive via env at the
# gate that introduces persistence (GATE 3); none is needed to run this skeleton.
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
