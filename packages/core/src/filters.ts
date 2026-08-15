/**
 * Garrett's Team Value filter.
 *
 * The gate a task passes before it is allowed to take up space in a day plan.
 * It scores on team value rather than urgency, on the premise that a day full
 * of urgent-but-low-value work reads as productive and isn't.
 *
 * Three escape hatches keep the gate from being destructive:
 *   - `alwaysInclude` lets committed MoSCoW levels bypass the score entirely,
 *     so a `must` never silently vanishes.
 *   - `includeUnrated` decides whether not-yet-rated work is shown or hidden.
 *     Defaults to showing it — hiding unrated tasks makes the filter look
 *     like data loss.
 *   - `passesTeamValueFilter` returns a reason, so the UI can always explain
 *     why something was set aside.
 */

import {
  type MorningBrewTask,
  type MoscowPriority,
  type TeamValueScore,
  isActive,
} from "./task.ts";

export interface TeamValueFilter {
  /** Minimum team-value score a rated task must meet. */
  minScore: TeamValueScore;
  /** Show tasks that have no team-value rating yet. */
  includeUnrated: boolean;
  /** MoSCoW levels exempt from the score gate. */
  alwaysInclude: readonly MoscowPriority[];
  /** Drop done/dropped/parked tasks. */
  activeOnly: boolean;
}

/**
 * Sensible starting point: keep anything committed to, keep unrated work
 * visible, and gate the rest at "helps one teammate" or better.
 */
export const DEFAULT_TEAM_VALUE_FILTER: TeamValueFilter = {
  minScore: 2,
  includeUnrated: true,
  alwaysInclude: ["must"],
  activeOnly: true,
};

export type TeamValueFilterReason =
  | "included_active"
  | "included_priority_exempt"
  | "included_unrated"
  | "included_score_met"
  | "excluded_inactive"
  | "excluded_unrated"
  | "excluded_below_min_score";

export interface TeamValueFilterVerdict {
  passes: boolean;
  reason: TeamValueFilterReason;
  /** One line, ready to render next to the task. */
  explanation: string;
}

/**
 * Evaluate one task against the filter.
 *
 * Order matters: inactivity is checked first (a done task is never relevant),
 * then the priority exemption (a `must` outranks its own score), then the
 * score gate.
 */
export function passesTeamValueFilter(
  task: MorningBrewTask,
  filter: TeamValueFilter = DEFAULT_TEAM_VALUE_FILTER,
): TeamValueFilterVerdict {
  if (filter.activeOnly && !isActive(task)) {
    return {
      passes: false,
      reason: "excluded_inactive",
      explanation: `Status is "${task.status}".`,
    };
  }

  if (task.priority && filter.alwaysInclude.includes(task.priority)) {
    return {
      passes: true,
      reason: "included_priority_exempt",
      explanation: `Priority "${task.priority}" bypasses the team-value gate.`,
    };
  }

  const score = task.teamValue?.score;

  if (score === undefined) {
    return filter.includeUnrated
      ? {
          passes: true,
          reason: "included_unrated",
          explanation: "No team-value rating yet — shown so it can be rated.",
        }
      : {
          passes: false,
          reason: "excluded_unrated",
          explanation: "No team-value rating yet.",
        };
  }

  return score >= filter.minScore
    ? {
        passes: true,
        reason: "included_score_met",
        explanation: `Team value ${score} meets the minimum of ${filter.minScore}.`,
      }
    : {
        passes: false,
        reason: "excluded_below_min_score",
        explanation: `Team value ${score} is below the minimum of ${filter.minScore}.`,
      };
}

export interface TeamValueFilterResult {
  included: MorningBrewTask[];
  /** Kept, not discarded — the UI offers these behind a "show set aside" toggle. */
  excluded: Array<{ task: MorningBrewTask; verdict: TeamValueFilterVerdict }>;
}

/** Partition a task list into what reaches the plan and what was set aside. */
export function applyTeamValueFilter(
  tasks: readonly MorningBrewTask[],
  filter: TeamValueFilter = DEFAULT_TEAM_VALUE_FILTER,
): TeamValueFilterResult {
  const included: MorningBrewTask[] = [];
  const excluded: TeamValueFilterResult["excluded"] = [];

  for (const task of tasks) {
    const verdict = passesTeamValueFilter(task, filter);
    if (verdict.passes) included.push(task);
    else excluded.push({ task, verdict });
  }

  return { included, excluded };
}
