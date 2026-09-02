Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## Available CLI Commands

| Command | Target | Description |
| :--- | :--- | :--- |
| `bun dev` | `bun --hot packages/dashboard/src/server.ts` | Starts the dashboard dev server with hot reload on http://localhost:3000 |
| `bun start` | `bun packages/dashboard/src/server.ts` | Runs the production dashboard server on http://localhost:3000 |
| `bun test` | `bun test` | Runs all unit tests across `@morningbrew/core` and `@morningbrew/dashboard` |
| `bun run typecheck` | `tsc --noEmit` | Runs workspace TypeScript static type checks |
| `bun run lint` | `biome check .` | Runs Biome code formatting and lint checks |
| `bun run lint:fix` | `biome check --write .` | Auto-formats and fixes lint issues with Biome |
| `bun run build` | `bun build ...` | Compiles dashboard frontend app into bundle assets |

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

---

## MorningBrew project conventions

- Tooling is pinned in `.mise.toml`. Bun only — never npm/yarn/pnpm. `uv` for Python.
- Workspace packages live in `packages/*`. Import from the package root
  (`@morningbrew/core`), never a deep path.
- All source plugins implement `MorningBrewSourcePlugin` from `@morningbrew/core`.
  Read is required; each write-back is gated by a matching `capabilities` flag.
- Plugins must not read `process.env` directly — take config and secrets from
  `PluginContext`.
- Task content is private. Don't log task titles or notes; don't commit anything
  under `.morningbrew/`, `data/`, or `.env`.
- Official app mascot is **Brewie** ☕✨. Keep branding warm, cozy, and anti-overwhelm.
