/**
 * Shared constants for the core engine.
 *
 * Anything secret lives in the environment (see `.env.example`), never here.
 */

/**
 * The Monday.com board MorningBrew treats as the system of record for
 * status and parking write-backs.
 *
 * Overridable via `MONDAY_BOARD_ID` so a second board can be pointed at for
 * testing without touching real work items.
 */
export const DEFAULT_MONDAY_BOARD_ID = "18425029943";

/** Namespace separator used to build globally-unique task ids. */
export const TASK_ID_SEPARATOR = ":";
