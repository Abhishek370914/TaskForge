import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns';

/**
 * Format a date string for display in the task card header.
 * Shows relative labels for today/tomorrow/yesterday, otherwise a short date.
 */
export const formatDeadline = (isoString: string): string => {
  const date = new Date(isoString);

  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
};

/**
 * Format a date for display in the task detail / created-at label.
 */
export const formatCreatedAt = (isoString: string): string => {
  return format(new Date(isoString), 'MMM d, yyyy · h:mm a');
};

/**
 * Returns true when the task deadline has already passed and task is not done.
 */
export const isOverdue = (deadline: string, completed: boolean): boolean => {
  return !completed && isPast(new Date(deadline));
};
