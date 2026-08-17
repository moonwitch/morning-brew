/**
 * G-Factor (Garrett's Team Value Filter).
 *
 * The gate a work task passes before taking up space in a day plan.
 * Scores on team value (G-Factor) rather than urgency alone, on the premise
 * that a day full of urgent-but-low-value work reads as productive and isn't.
 */

import {
  type MorningBrewTask,
  type MoscowPriority,
  isActive,
} from "./task.ts";

export type TeamValueScore = 0 | 1 | 2 | 3 | 4 | 5;

export interface TeamValueFilter {
  /** Minimum G-Factor score a rated task must meet. */
  minScore: TeamValueScore;
  /** Show tasks that have no G-Factor rating yet. */
  includeUnrated: boolean;
  /** MoSCoW levels exempt from the score gate. */
  alwaysInclude: readonly MoscowPriority[];
  /** Drop done/dropped/parked tasks. */
  activeOnly: boolean;
}

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
  explanation: string;
}

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
      explanation: `Priority "${task.priority}" bypasses the G-Factor score gate.`,
    };
  }

  const score = task.teamValue;

  if (score === undefined) {
    return filter.includeUnrated
      ? {
          passes: true,
          reason: "included_unrated",
          explanation: "No G-Factor rating yet — shown so it can be rated.",
        }
      : {
          passes: false,
          reason: "excluded_unrated",
          explanation: "No G-Factor rating yet.",
        };
  }

  return score >= filter.minScore
    ? {
        passes: true,
        reason: "included_score_met",
        explanation: `G-Factor score ${score} meets the minimum threshold of ${filter.minScore}.`,
      }
    : {
        passes: false,
        reason: "excluded_below_min_score",
        explanation: `G-Factor score ${score} is below the minimum threshold of ${filter.minScore}.`,
      };
}

export interface TeamValueFilterResult {
  included: MorningBrewTask[];
  excluded: Array<{ task: MorningBrewTask; verdict: TeamValueFilterVerdict }>;
}

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
