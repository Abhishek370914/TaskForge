/**
 * EmptyState — Illustrated empty state component
 *
 * Shown when no tasks match the current filters.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../assets/theme';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks yet',
  subtitle = 'Tap the + button to add your first task!',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.illustration}>📋</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  illustration: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.titleLarge,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});
