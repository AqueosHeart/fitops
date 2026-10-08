FROM node:24.14.0-bookworm-slim AS build

WORKDIR /app

# Prisma config requires these values at build time; use inert placeholders only.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build?schema=public
ENV BETTER_AUTH_SECRET=build-only-placeholder-secret-build-only-placeholder
ENV BETTER_AUTH_URL=http://localhost:3000
ENV FITOPS_DEMO_PASSWORD=build-only-placeholder-password

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate && npm run build

FROM node:24.14.0-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app ./
USER node

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start -- --hostname 0.0.0.0"]
