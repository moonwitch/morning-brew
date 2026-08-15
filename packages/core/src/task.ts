/**
 * The canonical task model.
 *
 * Every source plugin normalizes its own records into `MorningBrewTask` so the
 * planner, the filters, and the UI only ever deal with one shape. Source-
 * specific detail survives in `raw` for round-tripping on write-back.
 *
 * Timestamps are ISO-8601 strings and dates are `YYYY-MM-DD` strings, chosen
 * over `Date` so tasks stay trivially serializable to disk and over the wire.
 */

import { TASK_ID_SEPARATOR } from "./constants.ts";

// ---------------------------------------------------------------------------
// Effort — T-shirt sizes
// ---------------------------------------------------------------------------

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL"] as const;

/** Effort estimate. Deliberately coarse — precision invites over-planning. */
export type TShirtSize = (typeof TSHIRT_SIZES)[number];

/**
 * Nominal minutes per size, used to budget a day against available focus time.
 *
 * These are planning defaults, not measurements. The engine treats them as a
 * starting point that per-user calibration can override.
 */
export const TSHIRT_SIZE_MINUTES: Readonly<Record<TShirtSize, number>> = {
  XS: 10,
  S: 30,
  M: 60,
  L: 180,
  XL: 480,
};

export function isTShirtSize(value: unknown): value is TShirtSize {
  return TSHIRT_SIZES.includes(value as TShirtSize);
}

/** Minutes a task is expected to cost. Unsized tasks report `null`. */
export function estimatedMinutes(task: MorningBrewTask): number | null {
  return task.size ? TSHIRT_SIZE_MINUTES[task.size] : null;
}

// ---------------------------------------------------------------------------
// Priority — MoSCoW
// ---------------------------------------------------------------------------

export const MOSCOW_PRIORITIES = ["must", "should", "could", "wont"] as const;

/** MoSCoW priority. `wont` means "not this cycle", not "never". */
export type MoscowPriority = (typeof MOSCOW_PRIORITIES)[number];

/** Sort weight — lower sorts first. */
export const MOSCOW_RANK: Readonly<Record<MoscowPriority, number>> = {
  must: 0,
  should: 1,
  could: 2,
  wont: 3,
};

export function isMoscowPriority(value: unknown): value is MoscowPriority {
  return MOSCOW_PRIORITIES.includes(value as MoscowPriority);
}

// ---------------------------------------------------------------------------
// Team value — the axis Garrett's filter scores against
// ---------------------------------------------------------------------------

/**
 * How much a task moves the *team* forward, independent of how urgent or
 * large it is. A 0-5 rating rather than a boolean so the filter threshold can
 * be dialled per-day: a heavy day tightens to 4+, a slow day opens to 1+.
 */
export type TeamValueScore = 0 | 1 | 2 | 3 | 4 | 5;

export const TEAM_VALUE_SCORES: readonly TeamValueScore[] = [0, 1, 2, 3, 4, 5];

/** Human labels for the rating scale, for UI and log output. */
export const TEAM_VALUE_LABELS: Readonly<Record<TeamValueScore, string>> = {
  0: "No team value",
  1: "Marginal",
  2: "Helps one teammate",
  3: "Unblocks the team",
  4: "Moves a team goal",
  5: "Critical to the team",
};

export interface TeamValue {
  score: TeamValueScore;
  /** Why this score. Surfaced in the UI so a rating stays auditable. */
  rationale?: string;
  /** Who rated it — a source-native user id or handle. */
  ratedBy?: string;
  /** ISO-8601 timestamp of the rating. */
  ratedAt?: string;
}

export function isTeamValueScore(value: unknown): value is TeamValueScore {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 5
  );
}

// ---------------------------------------------------------------------------
// Status and parking
// ---------------------------------------------------------------------------

export const TASK_STATUSES = [
  "backlog",
  "planned",
  "in_progress",
  "blocked",
  "parked",
  "done",
  "dropped",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Statuses that take a task out of active rotation. */
export const INACTIVE_STATUSES: readonly TaskStatus[] = [
  "parked",
  "done",
  "dropped",
];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus);
}

/**
 * Parking is the core attention-protection move: set a task down deliberately,
 * with a reason and a date it comes back, so it stops costing working memory
 * without being forgotten.
 *
 * Distinct from `blocked` — blocked is involuntary and waits on someone else;
 * parked is a choice.
 */
export interface ParkingDetails {
  /** Why it was parked. Required — an unexplained park resurfaces as dread. */
  reason: string;
  /** ISO-8601 timestamp of when it was parked. */
  parkedAt: string;
  /**
   * `YYYY-MM-DD` to bring it back. Omitted means "until I say otherwise",
   * which the UI surfaces separately so nothing parks indefinitely by accident.
   */
  resurfaceOn?: string;
  parkedBy?: string;
}

// ---------------------------------------------------------------------------
// The task
// ---------------------------------------------------------------------------

export interface MorningBrewTask<TRaw = unknown> {
  /**
   * Globally unique across sources: `${sourceId}:${sourceTaskId}`.
   * Build with `buildTaskId` rather than by hand.
   */
  id: string;
  /** `id` of the plugin that produced this task. */
  sourceId: string;
  /** The task's id in its own system, used for write-back. */
  sourceTaskId: string;

  title: string;
  notes?: string;
  /** Deep link back into the source, so the UI can hand off. */
  url?: string;

  status: TaskStatus;
  size?: TShirtSize;
  priority?: MoscowPriority;
  teamValue?: TeamValue;

  /** Present when and only when `status === "parked"`. */
  parking?: ParkingDetails;

  /** `YYYY-MM-DD`. */
  dueOn?: string;
  /** `YYYY-MM-DD` — the day this is planned for. */
  scheduledFor?: string;

  assignees?: string[];
  tags?: string[];

  /** ISO-8601. */
  createdAt?: string;
  /** ISO-8601. */
  updatedAt?: string;

  /**
   * The untouched source record. Plugins read this back on write so they can
   * construct a correct update without re-fetching.
   */
  raw?: TRaw;
}

export function buildTaskId(sourceId: string, sourceTaskId: string): string {
  return `${sourceId}${TASK_ID_SEPARATOR}${sourceTaskId}`;
}

/** Inverse of `buildTaskId`. Returns `null` if the id is not well-formed. */
export function parseTaskId(
  id: string,
): { sourceId: string; sourceTaskId: string } | null {
  const index = id.indexOf(TASK_ID_SEPARATOR);
  if (index <= 0 || index === id.length - 1) return null;
  return {
    sourceId: id.slice(0, index),
    sourceTaskId: id.slice(index + TASK_ID_SEPARATOR.length),
  };
}

export function isActive(task: MorningBrewTask): boolean {
  return !INACTIVE_STATUSES.includes(task.status);
}

/**
 * Whether a parked task is due to come back on `today` (`YYYY-MM-DD`).
 * Parked tasks with no `resurfaceOn` never auto-resurface.
 */
export function shouldResurface(task: MorningBrewTask, today: string): boolean {
  const resurfaceOn = task.parking?.resurfaceOn;
  if (task.status !== "parked" || !resurfaceOn) return false;
  return resurfaceOn <= today;
}
