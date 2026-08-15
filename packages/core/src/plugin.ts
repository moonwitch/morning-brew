/**
 * The source plugin contract.
 *
 * A source plugin owns one system of record (Monday, a calendar, a notes file)
 * and does two things: hands MorningBrew normalized tasks, and accepts
 * write-backs when the user changes something in the dashboard.
 *
 * Design rules:
 *   - Read is required, write is optional. A source that can only be read is a
 *     first-class plugin; `capabilities` tells the UI which controls to show
 *     rather than letting the user click something that will fail.
 *   - Write-backs are callbacks, not fire-and-forget events. They resolve with
 *     a `WriteResult` so the dashboard can roll an optimistic update back.
 *   - Plugins never read `process.env` directly. Config and secrets arrive
 *     through `PluginContext`, which keeps secret handling in one auditable
 *     place and makes plugins testable.
 */

import type {
  MorningBrewTask,
  MoscowPriority,
  ParkingDetails,
  TShirtSize,
  TaskStatus,
  TeamValue,
} from "./task.ts";

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------

/** What a given source can actually do, so the UI can disable the rest. */
export interface SourceCapabilities {
  /** Supports `onStatusChange`. */
  writeStatus: boolean;
  /** Supports `onPark` / `onUnpark`. */
  writeParking: boolean;
  writeSize: boolean;
  writePriority: boolean;
  writeTeamValue: boolean;
  /** `fetchTasks` honours `TaskQuery.since` for incremental sync. */
  incrementalSync: boolean;
}

export const NO_WRITE_CAPABILITIES: SourceCapabilities = {
  writeStatus: false,
  writeParking: false,
  writeSize: false,
  writePriority: false,
  writeTeamValue: false,
  incrementalSync: false,
};

// ---------------------------------------------------------------------------
// Context handed to a plugin at init
// ---------------------------------------------------------------------------

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface PluginLogger {
  /**
   * Implementations redact task titles and notes unless
   * `MORNINGBREW_REDACT_LOGS=false`. Do not defeat this by interpolating task
   * content into the message string.
   */
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
}

export interface PluginContext<TConfig = unknown> {
  /** Validated, plugin-specific config from the user's MorningBrew settings. */
  config: TConfig;
  /**
   * Reads a secret by env var name. Goes through the host so secret access is
   * logged and so a plugin cannot enumerate the whole environment.
   */
  getSecret(name: string): string | undefined;
  logger: PluginLogger;
  /** Injected clock — keeps plugin behaviour deterministic under test. */
  now(): Date;
  /** Aborted when the host shuts down or the user cancels a sync. */
  signal: AbortSignal;
}

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

export interface TaskQuery {
  /**
   * Return only tasks changed at or after this ISO-8601 timestamp.
   * Only meaningful when `capabilities.incrementalSync` is true; other
   * plugins should ignore it and return everything.
   */
  since?: string;
  /** Restrict to these statuses. Omitted means all. */
  statuses?: readonly TaskStatus[];
  /** The day being planned, `YYYY-MM-DD`. */
  planningDate?: string;
  /** Soft cap on returned tasks. Plugins may return fewer. */
  limit?: number;
}

export interface FetchResult<TRaw = unknown> {
  tasks: Array<MorningBrewTask<TRaw>>;
  /** ISO-8601 watermark to pass as the next `TaskQuery.since`. */
  syncedAt: string;
  /**
   * Non-fatal problems — e.g. three items failed to normalize but ninety
   * succeeded. The dashboard surfaces these without failing the whole sync.
   */
  warnings?: string[];
}

// ---------------------------------------------------------------------------
// Writing back
// ---------------------------------------------------------------------------

/** Fields common to every write-back, so plugins can log and audit uniformly. */
interface WriteBackBase {
  task: MorningBrewTask;
  /** ISO-8601 timestamp of the user action that triggered this. */
  at: string;
  /**
   * Set when the change was made by the engine rather than the user — e.g. a
   * parked task auto-resurfacing. Lets a plugin choose not to notify.
   */
  automated?: boolean;
}

export interface StatusChange extends WriteBackBase {
  from: TaskStatus;
  to: TaskStatus;
}

export interface ParkChange extends WriteBackBase {
  parking: ParkingDetails;
}

export interface UnparkChange extends WriteBackBase {
  /** Status the task returns to. */
  to: TaskStatus;
  /** Why it came back — user action, or the `resurfaceOn` date arriving. */
  trigger: "manual" | "resurfaced";
}

export interface SizeChange extends WriteBackBase {
  from?: TShirtSize;
  to?: TShirtSize;
}

export interface PriorityChange extends WriteBackBase {
  from?: MoscowPriority;
  to?: MoscowPriority;
}

export interface TeamValueChange extends WriteBackBase {
  from?: TeamValue;
  to?: TeamValue;
}

export interface WriteResult {
  ok: boolean;
  /**
   * The task as the source now holds it. Returning it lets the dashboard
   * reconcile against reality instead of trusting its optimistic update —
   * which matters when the source normalizes or rejects a value.
   */
  task?: MorningBrewTask;
  /** Present when `ok` is false. Shown to the user, so keep it plain. */
  error?: string;
  /** True if the failure is worth retrying (rate limit, transient network). */
  retryable?: boolean;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export interface PluginHealth {
  ok: boolean;
  /** One line for the dashboard's source list. */
  detail?: string;
  checkedAt: string;
}

// ---------------------------------------------------------------------------
// The plugin
// ---------------------------------------------------------------------------

export interface MorningBrewSourcePlugin<TConfig = unknown, TRaw = unknown> {
  /** Stable, unique, kebab-case — becomes the task id namespace. */
  readonly id: string;
  /** Display name for the UI. */
  readonly name: string;
  /** Semver of the plugin itself. */
  readonly version: string;
  readonly capabilities: SourceCapabilities;

  /** Called once before any fetch. Validate config and fail loudly here. */
  init?(context: PluginContext<TConfig>): Promise<void> | void;

  /** Cheap connectivity/auth probe for the dashboard's source list. */
  healthCheck?(): Promise<PluginHealth>;

  /** The one required method. */
  fetchTasks(query: TaskQuery): Promise<FetchResult<TRaw>>;

  // Write-backs. Implement each only where the matching capability is true;
  // the host checks `capabilities` before calling.
  onStatusChange?(change: StatusChange): Promise<WriteResult>;
  onPark?(change: ParkChange): Promise<WriteResult>;
  onUnpark?(change: UnparkChange): Promise<WriteResult>;
  onSizeChange?(change: SizeChange): Promise<WriteResult>;
  onPriorityChange?(change: PriorityChange): Promise<WriteResult>;
  onTeamValueChange?(change: TeamValueChange): Promise<WriteResult>;

  /** Release connections, timers, watchers. */
  dispose?(): Promise<void> | void;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * A plugin of unknown config/raw shape.
 *
 * `any` rather than `unknown` is deliberate: the registry stores plugins with
 * mutually incompatible type arguments, and `unknown` in the covariant `TRaw`
 * position would reject every concrete plugin. Callers that need the real
 * types hold their own typed reference.
 */
// biome-ignore lint/suspicious/noExplicitAny: heterogeneous registry, see above
export type AnySourcePlugin = MorningBrewSourcePlugin<any, any>;

/**
 * Holds the registered sources. Intentionally minimal — it owns identity and
 * lookup only. Sync scheduling and conflict resolution belong to the engine
 * built on top of it.
 */
export class PluginRegistry {
  readonly #plugins = new Map<string, AnySourcePlugin>();

  register(plugin: AnySourcePlugin): void {
    if (this.#plugins.has(plugin.id)) {
      throw new Error(
        `Duplicate source plugin id "${plugin.id}" — ids namespace task ids and must be unique.`,
      );
    }
    this.#plugins.set(plugin.id, plugin);
  }

  get(id: string): AnySourcePlugin | undefined {
    return this.#plugins.get(id);
  }

  list(): AnySourcePlugin[] {
    return [...this.#plugins.values()];
  }

  /** Sources declaring a given capability — used to gate UI controls. */
  withCapability(capability: keyof SourceCapabilities): AnySourcePlugin[] {
    return this.list().filter((plugin) => plugin.capabilities[capability]);
  }
}
