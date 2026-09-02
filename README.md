# MorningBrew

A modular, plugin-based task aggregator and day-planning dashboard, built for
neurodivergent focus.

MorningBrew pulls tasks from whatever systems you actually work in, normalizes
them into one model, and filters them down to a day you can hold in your head.
The design bias throughout: **fewer decisions in the morning, nothing silently
lost, and every exclusion explained.**

## Requirements

Tooling is pinned in `.mise.toml`:

```sh
mise install     # installs bun 1.3.14
bun install      # installs workspace dependencies
```

Bun is the only JS runtime and package manager here — no npm, yarn, or pnpm.

## Setup

```sh
cp .env.example .env    # then fill in MONDAY_API_TOKEN
```

`.env` is git-ignored. Bun loads it automatically — don't add `dotenv`.

## CLI Commands & Scripts

All primary tasks can be executed directly from your terminal using Bun CLI commands:

| Command | Action | Description |
| :--- | :--- | :--- |
| **`bun dev`** | **`bun --hot packages/dashboard/src/server.ts`** | Starts the MorningBrew dashboard server in hot-reload mode on `http://localhost:3000` |
| **`bun start`** | **`bun packages/dashboard/src/server.ts`** | Runs the production dashboard server |
| **`bun test`** | **`bun test`** | Runs the complete unit test suite across all workspace packages |
| **`bun run typecheck`** | **`tsc --noEmit`** | Performs full workspace TypeScript static type checks |
| **`bun run lint`** | **`biome check .`** | Checks code formatting and lints with Biome |
| **`bun run lint:fix`** | **`biome check --write .`** | Auto-formats and fixes linting issues |
| **`bun run build`** | **`bun build ...`** | Bundles the dashboard frontend application into `dist` |

---

## Layout

```
packages/
  core/               @morningbrew/core — task model, plugin contract, filters
    src/
      task.ts         MorningBrewTask, T-shirt sizes, MoSCoW, status, parking
      filters.ts      G-Factor (Garrett's Team Value filter)
      plugin.ts       MorningBrewSourcePlugin, PluginRegistry
      constants.ts    Monday board id and TSHIRT_SIZE_MINUTES constants
  dashboard/          @morningbrew/dashboard — React PWA dashboard server & UI
    src/
      App.tsx         Main dashboard container & navigation shell
      server.ts       Bun.serve() backend entrypoint serving app on http://localhost:3000
      sw.js           Offline PWA Service Worker
```

Downstream packages import from `@morningbrew/core` only — never from a deeper
path — so the public surface stays reviewable.

## Core concepts

### The task model

Every plugin normalizes its records into `MorningBrewTask`, keeping the
original payload in `raw` for round-tripping on write-back. Dates are
`YYYY-MM-DD` strings and timestamps are ISO-8601 strings so tasks stay trivially
serializable.

**T-shirt sizes** (`XS`–`XL`) estimate effort. `TSHIRT_SIZE_MINUTES` maps them
to nominal minutes so a day can be budgeted against real focus time. The scale
is deliberately coarse — precision invites over-planning.

**MoSCoW** (`must` / `should` / `could` / `wont`) carries priority. `wont` means
"not this cycle", not "never".

### Parking

Parking is the core attention-protection move: set a task down deliberately,
with a **required reason** and an optional `resurfaceOn` date, so it stops
costing working memory without being forgotten. `shouldResurface()` brings it
back on the day.

Parked is distinct from `blocked` — blocked is involuntary and waits on someone
else; parked is a choice.

### G-Factor (Garrett's Team Value filter)

The gate a task clears before it takes up space in a day plan. It scores on
**team value** (0–5) rather than urgency, on the premise that a day full of
urgent-but-low-value work reads as productive and isn't.

Three escape hatches keep the gate from being destructive:

- `alwaysInclude` exempts committed MoSCoW levels, so a `must` never silently
  vanishes.
- `includeUnrated` defaults to **showing** unrated work — hiding it would make
  the filter look like data loss.
- `applyTeamValueFilter` **partitions** rather than discards, and every verdict
  carries a plain-language `explanation` the UI can render next to the task.

```ts
import { applyTeamValueFilter, DEFAULT_TEAM_VALUE_FILTER } from "@morningbrew/core";

const { included, excluded } = applyTeamValueFilter(tasks, {
  ...DEFAULT_TEAM_VALUE_FILTER,
  minScore: 4, // a heavy day tightens the gate
});
```

### Source plugins

A source plugin owns one system of record and does two things: hand
MorningBrew normalized tasks, and accept write-backs when you change something
in the dashboard.

- **Read is required, write is optional.** `capabilities` tells the UI which
  controls to render, rather than letting you click something that will fail.
- **Write-backs are callbacks, not fire-and-forget events.** Each resolves with
  a `WriteResult` carrying the task as the source now holds it, so the
  dashboard reconciles against reality instead of trusting its optimistic
  update.
- **Plugins never read `process.env` directly.** Config and secrets arrive via
  `PluginContext`, which keeps secret access auditable and plugins testable.

```ts
const plugin: MorningBrewSourcePlugin<MyConfig, MyRecord> = {
  id: "monday",
  name: "Monday.com",
  version: "0.1.0",
  capabilities: { writeStatus: true, writeParking: true, /* … */ },
  async fetchTasks(query) { /* … */ },
  async onStatusChange(change) { /* … */ },
  async onPark(change) { /* … */ },
};
```

## Privacy & Offline PWA

This dashboard aggregates real task content from work systems. `.gitignore`
covers secrets, local task cache, sync state, and logs. `MORNINGBREW_REDACT_LOGS`
defaults to `true`.
The dashboard operates as a Progressive Web App (PWA) with Service Worker offline caching and local storage persistence.
