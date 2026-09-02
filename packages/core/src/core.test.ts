import { describe, expect, test } from "bun:test";

import { DEFAULT_MONDAY_BOARD_ID } from "./constants.ts";
import {
  DEFAULT_TEAM_VALUE_FILTER,
  applyTeamValueFilter,
  passesTeamValueFilter,
} from "./filters.ts";
import {
  type MorningBrewSourcePlugin,
  type PluginContext,
  PluginRegistry,
  type StatusChange,
} from "./plugin.ts";
import {
  type MorningBrewTask,
  buildTaskId,
  estimatedMinutes,
  parseTaskId,
  shouldResurface,
} from "./task.ts";

interface MondayConfig {
  boardId: string;
}
interface MondayItem {
  id: string;
  name: string;
}

function makeMondayPlugin(): MorningBrewSourcePlugin<MondayConfig, MondayItem> {
  return {
    id: "monday",
    name: "Monday.com",
    version: "0.1.0",
    capabilities: {
      writeStatus: true,
      writeParking: true,
      writeSize: true,
      writePriority: true,
      writeTeamValue: true,
      incrementalSync: true,
    },

    init() {},

    async fetchTasks() {
      const item: MondayItem = { id: "1", name: "Ship the sync" };
      return {
        tasks: [
          {
            id: buildTaskId("monday", item.id),
            source: "monday",
            sourceId: item.id,
            title: item.name,
            status: "todo",
            size: "M",
            priority: "should",
            teamValue: 4,
          },
        ],
        syncedAt: "2026-08-11T08:00:00.000Z",
      };
    },

    async onStatusChange(change: StatusChange) {
      return {
        ok: true,
        task: { ...change.task, status: change.to },
      };
    },
  };
}

function task(overrides: Partial<MorningBrewTask> = {}): MorningBrewTask {
  return {
    id: "test:1",
    source: "test",
    sourceId: "1",
    title: "A task",
    status: "todo",
    ...overrides,
  };
}

describe("task model", () => {
  test("task ids round-trip", () => {
    const id = buildTaskId("monday", "18425029943");
    expect(id).toBe("monday:18425029943");
    expect(parseTaskId(id)).toEqual({
      sourceId: "monday",
      sourceTaskId: "18425029943",
    });
  });

  test("parseTaskId rejects malformed ids", () => {
    expect(parseTaskId("nocolon")).toBeNull();
    expect(parseTaskId(":leading")).toBeNull();
    expect(parseTaskId("trailing:")).toBeNull();
  });

  test("source ids containing a separator still round-trip", () => {
    expect(parseTaskId("monday:board:1")).toEqual({
      sourceId: "monday",
      sourceTaskId: "board:1",
    });
  });

  test("t-shirt sizes map to planning minutes", () => {
    expect(estimatedMinutes(task({ size: "M" }))).toBe(60);
    expect(estimatedMinutes(task())).toBeNull();
  });

  test("parked tasks resurface on or after their date", () => {
    const parked = task({
      status: "parked",
      parked: {
        reason: "Waiting on design",
        parkedAt: "2026-08-01T09:00:00.000Z",
        resurfaceOn: "2026-08-11",
        previousStatus: "todo",
      },
    });
    expect(shouldResurface(parked, "2026-08-10")).toBe(false);
    expect(shouldResurface(parked, "2026-08-11")).toBe(true);
    expect(shouldResurface(parked, "2026-08-12")).toBe(true);
  });

  test("parked tasks with no resurface date never auto-return", () => {
    const parked = task({
      status: "parked",
      parked: { reason: "Deferred", parkedAt: "2026-08-01T09:00:00.000Z", previousStatus: "todo" },
    });
    expect(shouldResurface(parked, "2027-01-01")).toBe(false);
  });
});

describe("G-Factor filter", () => {
  test("gates on the minimum score", () => {
    expect(passesTeamValueFilter(task({ teamValue: 4 })).passes).toBe(true);
    expect(passesTeamValueFilter(task({ teamValue: 1 })).passes).toBe(false);
  });

  test("a must bypasses the score gate", () => {
    const verdict = passesTeamValueFilter(task({ priority: "must", teamValue: 0 }));
    expect(verdict.passes).toBe(true);
    expect(verdict.reason).toBe("included_priority_exempt");
  });

  test("unrated tasks are shown by default and hideable", () => {
    expect(passesTeamValueFilter(task()).reason).toBe("included_unrated");
    expect(
      passesTeamValueFilter(task(), {
        ...DEFAULT_TEAM_VALUE_FILTER,
        includeUnrated: false,
      }).passes,
    ).toBe(false);
  });

  test("inactive tasks are excluded before any other check", () => {
    const verdict = passesTeamValueFilter(task({ status: "done", priority: "must" }));
    expect(verdict.passes).toBe(false);
    expect(verdict.reason).toBe("excluded_inactive");
  });

  test("partitions rather than discards, with an explanation", () => {
    const result = applyTeamValueFilter([
      task({ id: "a", teamValue: 5 }),
      task({ id: "b", teamValue: 0 }),
    ]);
    expect(result.included.map((t) => t.id)).toEqual(["a"]);
    expect(result.excluded).toHaveLength(1);
    expect(result.excluded[0]?.verdict.explanation).toContain("below");
  });
});

describe("plugin contract", () => {
  test("a concrete plugin satisfies the interface and registers", async () => {
    const plugin = makeMondayPlugin();
    const registry = new PluginRegistry();
    registry.register(plugin);

    plugin.init?.({
      config: { boardId: DEFAULT_MONDAY_BOARD_ID },
      getSecret: () => undefined,
      logger: {
        log: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      },
      now: () => new Date("2026-08-11T08:00:00.000Z"),
      signal: AbortSignal.abort(),
    });

    expect(registry.get("monday")?.name).toBe("Monday.com");
    expect(registry.withCapability("writeParking")).toHaveLength(1);

    const { tasks } = await plugin.fetchTasks({});
    expect(tasks[0]?.title).toBe("Ship the sync");

    const result = await plugin.onStatusChange?.({
      task: tasks[0]!,
      from: "todo",
      to: "in_progress",
      at: "2026-08-11T08:05:00.000Z",
    });
    expect(result?.ok).toBe(true);
    expect(result?.task?.status).toBe("in_progress");
  });

  test("duplicate plugin ids are rejected", () => {
    const registry = new PluginRegistry();
    registry.register(makeMondayPlugin());
    expect(() => registry.register(makeMondayPlugin())).toThrow(/Duplicate/);
  });
});
