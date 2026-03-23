/**
 * AddTaskScreen — Full task creation form
 *
 * Fields: Title, Description, Deadline (DateTimePicker), Priority, Category
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import AuthInput from '../components/AuthInput';
import PrioritySelector from '../components/PrioritySelector';
import CategorySelector from '../components/CategorySelector';
import GradientButton from '../components/GradientButton';
import { Priority, Category } from '../types';
import { validateTaskTitle, validateDeadline } from '../utils/validators';
import { formatDeadline } from '../utils/formatDate';
import { Colors, Spacing, Typography, Radius } from '../assets/theme';

const AddTaskScreen: React.FC = () => {
  const { user } = useAuth();
  const { addTask, loading } = useTasks();
  const navigation = useNavigation();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ── Errors ───────────────────────────────────────────────────────────────────
  const [titleError, setTitleError] = useState<string | null>(null);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const tErr = validateTaskTitle(title);
    const dErr = validateDeadline(deadline ? deadline.toISOString() : null);
    setTitleError(tErr);
    setDeadlineError(dErr);
    return !tErr && !dErr;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    await addTask({
      userId: user.uid,
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      deadline: deadline!.toISOString(),
      priority,
      category,
      completed: false,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">

        {/* ── Title ─── */}
        <Text style={styles.screenTitle}>New Task</Text>

        {/* ── Task Title ─── */}
        <AuthInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          error={titleError}
          placeholder="What needs to be done?"
          returnKeyType="next"
        />

        {/* ── Description ─── */}
        <AuthInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details..."
          multiline
          numberOfLines={3}
          style={styles.multiline}
        />

        {/* ── Deadline ─── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DEADLINE</Text>
          <TouchableOpacity
            style={[
              styles.dateBtn,
              deadlineError ? styles.dateBtnError : null,
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={[
                styles.dateBtnText,
                !deadline && styles.dateBtnPlaceholder,
              ]}>
              {deadline ? formatDeadline(deadline.toISOString()) : 'Tap to select deadline…'}
            </Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>
          {deadlineError ? (
            <Text style={styles.errorText}>{deadlineError}</Text>
          ) : null}
        </View>

        {/* ── Priority ─── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PRIORITY</Text>
          <PrioritySelector selected={priority} onChange={setPriority} />
        </View>

        {/* ── Category ─── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <CategorySelector selected={category} onChange={setCategory} />
        </View>

        {/* ── Submit ─── */}
        <GradientButton
          label="Create Task"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        />

        {/* ── Cancel ─── */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Date-time picker ─── */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        minimumDate={new Date()}
        onConfirm={date => {
          setDeadline(date);
          setDeadlineError(null);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  screenTitle: {
    ...Typography.displayMedium,
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.label,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  multiline: {
    height: 88,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  dateBtnError: {
    borderColor: Colors.danger,
  },
  dateBtnText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  dateBtnPlaceholder: {
    color: Colors.textSecondary,
  },
  dateIcon: {
    fontSize: 16,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  submitBtn: {
    marginTop: Spacing.lg,
  },
  cancelBtn: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
