/**
 * Smart Sort Algorithm
 *
 * Scores each task using a weighted formula:
 *   score = (priority_weight × 0.5) + (deadline_urgency × 0.35) + (created_recency × 0.15)
 *
 * This is a pure function with no side effects.
 */
import { Task, SortOrder } from '../types';

// ── Priority weights ──────────────────────────────────────────────────────────

const PRIORITY_WEIGHT: Record<Task['priority'], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// ── Deadline urgency normalization cap (hours) ────────────────────────────────
const MAX_HOURS = 72; // tasks due in >72h are treated as least urgent

/**
 * Calculate the smart score for a single task.
 * Higher score = should appear earlier in the list.
 */
export const calcSmartScore = (task: Task): number => {
  // 1. Priority component (normalised 0–1)
  const priorityComponent = (PRIORITY_WEIGHT[task.priority] - 1) / 2; // maps {1,2,3} → {0, 0.5, 1}

  // 2. Deadline urgency component: inverse of hours until deadline, capped & normalised
  const hoursUntilDeadline = Math.max(
    0,
    (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60),
  );
  // Closer deadline → higher urgency.  Cap at MAX_HOURS so overdue all score 1.
  const deadlineComponent = 1 - Math.min(hoursUntilDeadline, MAX_HOURS) / MAX_HOURS;

  // 3. Recency component: tasks created in the last 7 days score highest
  const MAX_AGE_HOURS = 7 * 24;
  const ageHours = Math.max(
    0,
    (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60),
  );
  const recencyComponent = 1 - Math.min(ageHours, MAX_AGE_HOURS) / MAX_AGE_HOURS;

  // Weighted sum
  return (
    priorityComponent * 0.5 +
    deadlineComponent * 0.35 +
    recencyComponent * 0.15
  );
};

// ── Main sort function ────────────────────────────────────────────────────────

export const sortTasks = (tasks: Task[], order: SortOrder): Task[] => {
  const sorted = [...tasks]; // avoid mutating the original array

  switch (order) {
    case 'smart':
      return sorted.sort((a, b) => calcSmartScore(b) - calcSmartScore(a));

    case 'deadline':
      return sorted.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      );

    case 'priority':
      return sorted.sort(
        (a, b) =>
          PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority],
      );

    case 'created':
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
};
