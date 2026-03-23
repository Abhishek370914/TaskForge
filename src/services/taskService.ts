/**
 * Task Service
 *
 * Firestore CRUD operations for tasks.
 * All tasks live at: /tasks/{taskId}
 * Queried server-side by userId for security.
 */
import firestore from '@react-native-firebase/firestore';
import { Task } from '../types';

const COLLECTION = 'tasks';

// ── Reference helper ─────────────────────────────────────────────────────────

const tasksCollection = () => firestore().collection(COLLECTION);

// ── Create ───────────────────────────────────────────────────────────────────

export const createTask = async (
  task: Omit<Task, 'id'>,
): Promise<Task> => {
  const docRef = await tasksCollection().add(task);
  return { ...task, id: docRef.id };
};

// ── Read (all for user) ───────────────────────────────────────────────────────

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const snapshot = await tasksCollection()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    ...(doc.data() as Omit<Task, 'id'>),
    id: doc.id,
  }));
};

// ── Update ───────────────────────────────────────────────────────────────────

export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId'>>,
): Promise<void> => {
  await tasksCollection().doc(taskId).update(updates);
};

// ── Toggle complete ────────────────────────────────────────────────────────────

export const toggleTaskComplete = async (
  taskId: string,
  completed: boolean,
): Promise<void> => {
  await tasksCollection().doc(taskId).update({ completed });
};

// ── Delete ───────────────────────────────────────────────────────────────────

export const deleteTask = async (taskId: string): Promise<void> => {
  await tasksCollection().doc(taskId).delete();
};
