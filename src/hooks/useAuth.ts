/**
 * useAuth hook
 *
 * Convenience hook to access auth state and dispatch auth actions.
 */
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, register, logout, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    user,
    loading,
    error,
    initialized,
    login: (email: string, password: string) =>
      dispatch(login({ email, password })),
    register: (email: string, password: string) =>
      dispatch(register({ email, password })),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};
