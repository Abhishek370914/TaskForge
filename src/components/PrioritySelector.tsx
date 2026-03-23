/**
 * PrioritySelector — Pill-based priority picker (Low / Medium / High)
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Priority } from '../types';
import { Colors, Spacing, Radius, Typography } from '../assets/theme';

const OPTIONS: { label: string; value: Priority; color: string }[] = [
  { label: 'Low', value: 'low', color: Colors.priorityLow },
  { label: 'Medium', value: 'medium', color: Colors.priorityMedium },
  { label: 'High', value: 'high', color: Colors.priorityHigh },
];

interface PrioritySelectorProps {
  selected: Priority;
  onChange: (p: Priority) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <View style={styles.row}>
      {OPTIONS.map(opt => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.pill,
              { borderColor: opt.color },
              isSelected && { backgroundColor: opt.color },
            ]}>
            <Text
              style={[
                styles.pillText,
                { color: isSelected ? Colors.background : opt.color },
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PrioritySelector;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  pillText: {
    ...Typography.label,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
