/**
 * Redux Store
 *
 * Combines auth and tasks reducers.  Exports typed hooks for use across the app.
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Firebase objects are non-serializable — suppress the warning for them
      serializableCheck: false,
    }),
});

// ── Typed helpers ─────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
