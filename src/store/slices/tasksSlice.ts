/**
 * Tasks Redux Slice
 *
 * Manages all tasks for the authenticated user.
 * Async thunks wrap taskService Firestore calls.
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from '../../services/taskService';
import { Task, TaskFilters } from '../../types';

// ── State Shape ───────────────────────────────────────────────────────────────

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    category: 'all',
    sort: 'smart',
  },
};

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loadTasks = createAsyncThunk<
  Task[],
  string,          // userId
  { rejectValue: string }
>('tasks/load', async (userId, { rejectWithValue }) => {
  try {
    return await fetchTasks(userId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load tasks';
    return rejectWithValue(message);
  }
});

export const addTask = createAsyncThunk<
  Task,
  Omit<Task, 'id'>,
  { rejectValue: string }
>('tasks/add', async (taskData, { rejectWithValue }) => {
  try {
    return await createTask(taskData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create task';
    return rejectWithValue(message);
  }
});

export const editTask = createAsyncThunk<
  void,
  { taskId: string; updates: Partial<Omit<Task, 'id' | 'userId'>> },
  { rejectValue: string }
>('tasks/edit', async ({ taskId, updates }, { rejectWithValue }) => {
  try {
    await updateTask(taskId, updates);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task';
    return rejectWithValue(message);
  }
});

export const toggleComplete = createAsyncThunk<
  { taskId: string; completed: boolean },
  { taskId: string; completed: boolean },
  { rejectValue: string }
>('tasks/toggleComplete', async ({ taskId, completed }, { rejectWithValue }) => {
  try {
    await toggleTaskComplete(taskId, completed);
    return { taskId, completed };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task';
    return rejectWithValue(message);
  }
});

export const removeTask = createAsyncThunk<
  string,        // returns the deleted taskId so we can remove it from state
  string,
  { rejectValue: string }
>('tasks/remove', async (taskId, { rejectWithValue }) => {
  try {
    await deleteTask(taskId);
    return taskId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete task';
    return rejectWithValue(message);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTasks(state) {
      state.items = [];
    },
  },
  extraReducers: builder => {
    // ── Load Tasks ──
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load tasks';
      });

    // ── Add Task ──
    builder
      .addCase(addTask.pending, state => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // prepend for instant feedback
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create task';
      });

    // ── Edit Task ── (optimistic update handled in UI; this just marks done)
    builder.addCase(editTask.rejected, (state, action) => {
      state.error = action.payload ?? 'Failed to update task';
    });

    // ── Toggle Complete ──
    builder.addCase(toggleComplete.fulfilled, (state, action) => {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (task) {
        task.completed = action.payload.completed;
      }
    });

    // ── Remove Task ──
    builder.addCase(removeTask.fulfilled, (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    });
  },
});

export const { setFilters, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
