export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'parked';

export type TshirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type MoscowPriority = 'must' | 'should' | 'could' | 'wont';

export type EnergyFeel = 'easy' | 'standard' | 'draining';

export interface ParkedState {
  reason: string;
  resurfaceOn?: string; // YYYY-MM-DD
  parkedAt: string;     // ISO timestamp
  previousStatus: TaskStatus;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface MorningBrewTask {
  id: string;               // e.g. "monday:12345"
  source: string;           // e.g. "monday", "github", "jira"
  sourceId: string;         // original upstream ID
  title: string;
  description?: string;
  status: TaskStatus;
  size?: TshirtSize;
  priority?: MoscowPriority;
  teamValue?: number;       // 0..5 score (G-Factor score)
  resurfaceOn?: string;     // YYYY-MM-DD
  startDate?: string;       // YYYY-MM-DD for multi-day tasks
  parked?: ParkedState;

  // Subtasks & Caregiver Co-Authoring
  subtasks?: SubTask[];
  addedByCaregiver?: string; // Name/Email of caregiver/co-author

  // Energy Tracking on Completion
  completionEnergyFeel?: EnergyFeel;
  completedAt?: string;      // ISO timestamp
}

export function isActive(task: MorningBrewTask): boolean {
  return task.status === 'todo' || task.status === 'in_progress';
}

export function buildTaskId(sourceId: string, sourceTaskId: string): string {
  return `${sourceId}:${sourceTaskId}`;
}

export function parseTaskId(id: string): { sourceId: string; sourceTaskId: string } | null {
  const idx = id.indexOf(':');
  if (idx <= 0 || idx === id.length - 1) return null;
  return {
    sourceId: id.slice(0, idx),
    sourceTaskId: id.slice(idx + 1),
  };
}

export function estimatedMinutes(task: MorningBrewTask): number | null {
  if (!task.size) return null;
  const map: Record<TshirtSize, number> = {
    XS: 15,
    S: 30,
    M: 60,
    L: 120,
    XL: 240,
  };
  return map[task.size] ?? null;
}

export function shouldResurface(task: MorningBrewTask, todayDateStr: string): boolean {
  if (task.status !== 'parked') return false;
  const resurfaceOn = task.parked?.resurfaceOn || task.resurfaceOn;
  if (!resurfaceOn) return false;
  return todayDateStr >= resurfaceOn;
}
