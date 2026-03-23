/**
 * Form & auth validators
 * Each validator returns an error string on failure, or null on success.
 */

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateTaskTitle = (title: string): string | null => {
  if (!title.trim()) return 'Title is required';
  if (title.trim().length > 100) return 'Title is too long (max 100 characters)';
  return null;
};

export const validateDeadline = (deadline: string | null): string | null => {
  if (!deadline) return 'Deadline is required';
  return null;
};
