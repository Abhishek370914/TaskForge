/**
 * ProfileScreen — User info, task stats, and logout
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { Colors, Spacing, Typography, Radius, Shadow } from '../assets/theme';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { allTasks } = useTasks();

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.completed).length;
    const active = allTasks.filter(t => !t.completed).length;
    const highPriority = allTasks.filter(t => t.priority === 'high' && !t.completed).length;
    const overdue = allTasks.filter(
      t => !t.completed && new Date(t.deadline) < new Date(),
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, highPriority, overdue, completionRate };
  }, [allTasks]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({
    label,
    value,
    color = Colors.textPrimary,
  }) => (
    <View style={statStyles.card}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      {/* ── Avatar / User Info ─── */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.email?.[0] ?? 'U').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.displayName}>
          {user?.displayName ?? 'Taskmaster'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* ── Stats Grid ─── */}
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} color={Colors.success} />
        <StatCard label="Active" value={stats.active} color={Colors.accent} />
        <StatCard label="High Priority" value={stats.highPriority} color={Colors.priorityHigh} />
        <StatCard label="Overdue" value={stats.overdue} color={Colors.danger} />
        <StatCard label="Completion" value={`${stats.completionRate}%`} color={Colors.accentSecondary} />
      </View>

      {/* ── Completion bar ─── */}
      <View style={styles.barContainer}>
        <Text style={styles.barLabel}>Completion Rate</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${stats.completionRate}%` }]} />
        </View>
      </View>

      {/* ── Logout ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.button,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
  },
  displayName: {
    ...Typography.titleLarge,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.body,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  barContainer: {
    marginBottom: Spacing.xl,
  },
  barLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  logoutText: {
    ...Typography.titleMedium,
    color: Colors.danger,
  },
});

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: '30%',
    flexGrow: 1,
    ...Shadow.card,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    ...Typography.caption,
    textAlign: 'center',
  },
});
