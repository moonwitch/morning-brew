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
mise install     # installs bun 1.3.6
bun install      # installs workspace dependencies
```

Bun is the only JS runtime and package manager here — no npm, yarn, or pnpm.
`uv` handles Python if a Python-based source plugin ever lands.

## Setup

```sh
cp .env.example .env    # then fill in MONDAY_API_TOKEN
```

`.env` is git-ignored. Bun loads it automatically — don't add `dotenv`.

## Commands

```sh
bun test              # run the suite
bun run typecheck     # tsc --noEmit across the workspace
mise run test         # same, via mise tasks
```

## Layout

```
packages/
  core/               @morningbrew/core — task model, plugin contract, filters
    src/
      task.ts         MorningBrewTask, T-shirt sizes, MoSCoW, status, parking
      filters.ts      Garrett's Team Value filter
      plugin.ts       MorningBrewSourcePlugin, PluginRegistry
      constants.ts    Monday board id and other non-secret constants
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

### Garrett's Team Value filter

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

The Monday board wired for status and parking write-backs is
`18425029943` (`DEFAULT_MONDAY_BOARD_ID`, overridable via `MONDAY_BOARD_ID`).

## Privacy

This dashboard aggregates real task content from work systems. `.gitignore`
covers secrets, the local task cache, sync state, plan history, and logs with
deliberately broad patterns. `MORNINGBREW_REDACT_LOGS` defaults to `true` —
logs are the easiest place to leak work content.
