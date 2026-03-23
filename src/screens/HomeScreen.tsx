/**
 * HomeScreen — Task list with FilterBar and smart sorted tasks
 *
 * Loads tasks on mount, re-sorts/re-filters reactively as filter state changes.
 */
import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { Colors, Spacing, Typography } from '../assets/theme';
import { AppTabParamList } from '../navigation/AppStack';
import { Task, TaskFilters } from '../types';

type HomeNav = BottomTabNavigationProp<AppTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    allTasks,
    loading,
    filters,
    loadTasks,
    toggleComplete,
    removeTask,
    setFilters,
  } = useTasks();
  const navigation = useNavigation<HomeNav>();

  // Load tasks once when the user is available
  useEffect(() => {
    if (user?.uid) {
      loadTasks(user.uid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleFilterChange = useCallback(
    (partial: Partial<TaskFilters>) => setFilters(partial),
    [setFilters],
  );

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <TaskCard
      task={item}
      index={index}
      onToggleComplete={toggleComplete}
      onDelete={removeTask}
    />
  );

  const completedCount = allTasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* ── Header ─── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.displayName ?? user?.email?.split('@')[0] ?? 'there'} 👋
          </Text>
          <Text style={styles.statsText}>
            {completedCount}/{allTasks.length} tasks completed
          </Text>
        </View>

        {/* Add task FAB (top-right shortcut) */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* ── Filter Bar ─── */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* ── Task List ─── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={
            <EmptyState
              title="No tasks here"
              subtitle={
                filters.status !== 'all' || filters.category !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Tap + to add your first task!'
              }
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.titleLarge,
  },
  statsText: {
    ...Typography.body,
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
  },
  listContent: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
