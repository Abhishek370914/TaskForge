// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high';

export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'other';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOrder =
  | 'smart'
  | 'deadline'
  | 'priority'
  | 'created';

// ─── Task Model ───────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;   // ISO string
  deadline: string;    // ISO string
  priority: Priority;
  category: Category;
  completed: boolean;
  tags?: string[];
}

// ─── User Model ───────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

// ─── Filter / Sort State ─────────────────────────────────────────────────────

export interface TaskFilters {
  status: FilterStatus;
  category: Category | 'all';
  sort: SortOrder;
}
