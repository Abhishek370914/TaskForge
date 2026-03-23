/**
 * useTasks hook
 *
 * Convenience hook to access tasks state, derived filtered+sorted list,
 * and dispatch task actions.
 */
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  loadTasks,
  addTask,
  toggleComplete,
  removeTask,
  setFilters,
  clearTasks,
} from '../store/slices/tasksSlice';
import { sortTasks } from '../utils/sortTasks';
import { Task, TaskFilters } from '../types';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters } = useSelector(
    (state: RootState) => state.tasks,
  );

  // Derive the filtered + sorted list reactively
  const filteredTasks = useMemo<Task[]>(() => {
    let result = items;

    // 1. Filter by completion status
    if (filters.status === 'active') {
      result = result.filter(t => !t.completed);
    } else if (filters.status === 'completed') {
      result = result.filter(t => t.completed);
    }

    // 2. Filter by category
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // 3. Sort
    return sortTasks(result, filters.sort);
  }, [items, filters]);

  return {
    tasks: filteredTasks,
    allTasks: items,
    loading,
    error,
    filters,
    loadTasks: (userId: string) => dispatch(loadTasks(userId)),
    addTask: (task: Omit<Task, 'id'>) => dispatch(addTask(task)),
    toggleComplete: (taskId: string, completed: boolean) =>
      dispatch(toggleComplete({ taskId, completed })),
    removeTask: (taskId: string) => dispatch(removeTask(taskId)),
    setFilters: (f: Partial<TaskFilters>) => dispatch(setFilters(f)),
    clearTasks: () => dispatch(clearTasks()),
  };
};
