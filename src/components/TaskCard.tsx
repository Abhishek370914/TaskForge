/**
 * TaskCard — Full task card with:
 *   - Priority badge (colored pill)
 *   - Category badge (outlined pill)
 *   - Deadline with overdue detection
 *   - Complete toggle (scale pulse animation on toggle)
 *   - Delete button with slide-out animation
 *   - Completed tasks: reduced opacity + strikethrough title
 *   - Entrance animation: fade + slide in from bottom
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Task } from '../types';
import { Colors, Spacing, Radius, Typography, Shadow } from '../assets/theme';
import { formatDeadline, isOverdue } from '../utils/formatDate';

// ── Priority badge colours ────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  high: '🔴 High',
  medium: '🟠 Medium',
  low: '🟢 Low',
};

const CATEGORY_LABEL: Record<Task['category'], string> = {
  work: '💼 Work',
  personal: '🙋 Personal',
  health: '❤️ Health',
  shopping: '🛒 Shopping',
  other: '📌 Other',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  index: number; // used to stagger entrance animations
}

// ── Component ─────────────────────────────────────────────────────────────────

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  index,
}) => {
  // ── Entrance animation (fade + slide up) ────────────────────────────────────
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 350,
        delay: index * 60, // stagger
        useNativeDriver: true,
      }),
      Animated.spring(entranceTranslateY, {
        toValue: 0,
        delay: index * 60,
        useNativeDriver: true,
        damping: 14,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Complete toggle animation (scale pulse) ─────────────────────────────────
  const checkScale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    // Quick scale pulse before dispatching
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 40,
      }),
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
      }),
    ]).start(() => onToggleComplete(task.id, !task.completed));
  };

  // ── Delete animation (slide out right) ──────────────────────────────────────
  const deleteTranslateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Animated.parallel([
            Animated.timing(deleteTranslateX, {
              toValue: 400,
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(deleteOpacity, {
              toValue: 0,
              duration: 280,
              useNativeDriver: true,
            }),
          ]).start(() => onDelete(task.id));
        },
      },
    ]);
  };

  const overdue = isOverdue(task.deadline, task.completed);
  const priorityColor = PRIORITY_COLOR[task.priority];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: Animated.multiply(entranceOpacity, deleteOpacity),
          transform: [
            { translateY: entranceTranslateY },
            { translateX: deleteTranslateX },
          ],
        },
        task.completed && styles.completedWrapper,
      ]}>
      <View style={styles.card}>
        {/* Left priority bar */}
        <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

        <View style={styles.content}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.badges}>
              {/* Priority badge */}
              <View
                style={[styles.badge, { borderColor: priorityColor }]}>
                <Text style={[styles.badgeText, { color: priorityColor }]}>
                  {PRIORITY_LABEL[task.priority]}
                </Text>
              </View>
              {/* Category badge */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {CATEGORY_LABEL[task.category]}
                </Text>
              </View>
            </View>

            {/* Delete button */}
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={2}>
            {task.title}
          </Text>

          {/* Description */}
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          {/* Footer row */}
          <View style={styles.footerRow}>
            <Text style={[styles.deadline, overdue && styles.deadlineOverdue]}>
              {overdue ? '⚠️ Overdue · ' : '📅 '}
              {formatDeadline(task.deadline)}
            </Text>

            {/* Complete toggle */}
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <TouchableOpacity
                onPress={handleToggle}
                style={[
                  styles.checkBtn,
                  task.completed && styles.checkBtnDone,
                ]}>
                <Text style={styles.checkBtnText}>
                  {task.completed ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default TaskCard;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm + 2,
  },
  completedWrapper: {
    opacity: 0.55,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadow.card,
  },
  priorityBar: {
    width: 4,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    flex: 1,
  },
  badge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  categoryBadge: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  deleteBtn: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  deleteBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  title: {
    ...Typography.titleMedium,
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  description: {
    ...Typography.body,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  deadline: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  deadlineOverdue: {
    color: Colors.danger,
  },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
  },
  checkBtnDone: {
    backgroundColor: Colors.accent,
  },
  checkBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
