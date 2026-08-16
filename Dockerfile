# MorningBrew Production Dockerfile
FROM oven/bun:1.3.14-alpine as base

WORKDIR /app

# Install workspace dependencies
COPY package.json bun.lock .mise.toml tsconfig.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/dashboard/package.json ./packages/dashboard/

RUN bun install --frozen-lockfile --production

# Copy source files
COPY packages ./packages
COPY README.md CLAUDE.md ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Run MorningBrew dashboard server
CMD ["bun", "run", "packages/dashboard/src/server.ts"]
