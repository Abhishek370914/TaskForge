/**
 * FilterBar — Filter by status/category and sort order controls
 *
 * Rendered as a compact horizontal scrollable bar above the task list.
 */
import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { FilterStatus, Category, SortOrder, TaskFilters } from '../types';
import { Colors, Spacing, Radius, Typography } from '../assets/theme';

// ── Data ──────────────────────────────────────────────────────────────────────

const STATUS_OPTS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
];

const CATEGORY_OPTS: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Health', value: 'health' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Other', value: 'other' },
];

const SORT_OPTS: { label: string; value: SortOrder }[] = [
  { label: '✨ Smart', value: 'smart' },
  { label: '⏰ Deadline', value: 'deadline' },
  { label: '🔥 Priority', value: 'priority' },
  { label: '🕐 Created', value: 'created' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters: TaskFilters;
  onFilterChange: (f: Partial<TaskFilters>) => void;
}

const Chip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <View style={styles.container}>
      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {STATUS_OPTS.map(o => (
          <Chip
            key={o.value}
            label={o.label}
            selected={filters.status === o.value}
            onPress={() => onFilterChange({ status: o.value })}
          />
        ))}
        <View style={styles.separator} />
        {CATEGORY_OPTS.map(o => (
          <Chip
            key={o.value}
            label={o.label}
            selected={filters.category === o.value}
            onPress={() => onFilterChange({ category: o.value })}
          />
        ))}
        <View style={styles.separator} />
        {SORT_OPTS.map(o => (
          <Chip
            key={o.value}
            label={o.label}
            selected={filters.sort === o.value}
            onPress={() => onFilterChange({ sort: o.value })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.xs,
  },
});
