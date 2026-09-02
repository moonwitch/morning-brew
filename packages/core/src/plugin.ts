/**
 * The source plugin contract.
 *
 * A source plugin owns one system of record (Monday, a calendar, a notes file)
 * and does two things: hands MorningBrew normalized tasks, and accepts
 * write-backs when the user changes something in the dashboard.
 */

import type {
  MorningBrewTask,
  MoscowPriority,
  ParkedState,
  TaskStatus,
  TshirtSize,
} from "./task.ts";

export interface SourceCapabilities {
  writeStatus: boolean;
  writeParking: boolean;
  writeSize: boolean;
  writePriority: boolean;
  writeTeamValue: boolean;
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

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface PluginLogger {
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
}

export interface PluginContext<TConfig = unknown> {
  config: TConfig;
  getSecret(name: string): string | undefined;
  logger: PluginLogger;
  now(): Date;
  signal: AbortSignal;
}

export interface TaskQuery {
  since?: string;
  statuses?: readonly TaskStatus[];
  planningDate?: string;
  limit?: number;
}

export interface FetchResult<TRaw = unknown> {
  tasks: Array<MorningBrewTask & { raw?: TRaw }>;
  syncedAt: string;
  warnings?: string[];
}

interface WriteBackBase {
  task: MorningBrewTask;
  at: string;
  automated?: boolean;
}

export interface StatusChange extends WriteBackBase {
  from: TaskStatus;
  to: TaskStatus;
}

export interface ParkChange extends WriteBackBase {
  parking: ParkedState;
}

export interface UnparkChange extends WriteBackBase {
  to: TaskStatus;
  trigger: "manual" | "resurfaced";
}

export interface SizeChange extends WriteBackBase {
  from?: TshirtSize;
  to?: TshirtSize;
}

export interface PriorityChange extends WriteBackBase {
  from?: MoscowPriority;
  to?: MoscowPriority;
}

export interface TeamValueChange extends WriteBackBase {
  from?: number;
  to?: number;
}

export interface WriteResult {
  ok: boolean;
  task?: MorningBrewTask;
  error?: string;
  retryable?: boolean;
}

export interface PluginHealth {
  ok: boolean;
  detail?: string;
  checkedAt: string;
}

export interface MorningBrewSourcePlugin<TConfig = unknown, TRaw = unknown> {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: SourceCapabilities;

  init?(context: PluginContext<TConfig>): Promise<void> | void;
  healthCheck?(): Promise<PluginHealth>;
  fetchTasks(query: TaskQuery): Promise<FetchResult<TRaw>>;

  onStatusChange?(change: StatusChange): Promise<WriteResult>;
  onPark?(change: ParkChange): Promise<WriteResult>;
  onUnpark?(change: UnparkChange): Promise<WriteResult>;
  onSizeChange?(change: SizeChange): Promise<WriteResult>;
  onPriorityChange?(change: PriorityChange): Promise<WriteResult>;
  onTeamValueChange?(change: TeamValueChange): Promise<WriteResult>;

  dispose?(): Promise<void> | void;
}

// biome-ignore lint/suspicious/noExplicitAny: heterogeneous registry
export type AnySourcePlugin = MorningBrewSourcePlugin<any, any>;

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

  withCapability(capability: keyof SourceCapabilities): AnySourcePlugin[] {
    return this.list().filter((plugin) => plugin.capabilities[capability]);
  }
}
