/**
 * CategorySelector — Horizontal scrollable category chip picker
 */
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Category } from '../types';
import { Colors, Spacing, Radius, Typography } from '../assets/theme';

const CATEGORIES: { label: string; value: Category; emoji: string }[] = [
  { label: 'Work', value: 'work', emoji: '💼' },
  { label: 'Personal', value: 'personal', emoji: '🙋' },
  { label: 'Health', value: 'health', emoji: '❤️' },
  { label: 'Shopping', value: 'shopping', emoji: '🛒' },
  { label: 'Other', value: 'other', emoji: '📌' },
];

interface CategorySelectorProps {
  selected: Category;
  onChange: (c: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {CATEGORIES.map(cat => {
        const isSelected = selected === cat.value;
        return (
          <TouchableOpacity
            key={cat.value}
            onPress={() => onChange(cat.value)}
            style={[styles.chip, isSelected && styles.chipSelected]}>
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}22`,
  },
  emoji: {
    fontSize: 14,
  },
  chipText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.accent,
  },
});
