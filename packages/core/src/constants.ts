/**
 * Shared constants for the core engine.
 *
 * Anything secret lives in the environment (see `.env.example`), never here.
 */

import type { TshirtSize } from "./task.ts";

/**
 * The Monday.com board MorningBrew treats as the system of record for
 * status and parking write-backs.
 */
export const DEFAULT_MONDAY_BOARD_ID = "18425029943";

/** Namespace separator used to build globally-unique task ids. */
export const TASK_ID_SEPARATOR = ":";

/**
 * Mapping of T-Shirt sizes to estimated planning minutes.
 */
export const TSHIRT_SIZE_MINUTES: Record<TshirtSize, number> = {
  XS: 15,
  S: 30,
  M: 60,
  L: 120,
  XL: 240,
};
