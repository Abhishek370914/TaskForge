/**
 * RootNavigator — Auth gate
 *
 * Subscribes to Firebase onAuthStateChanged and conditionally renders
 * either the AuthStack (unauthenticated) or AppStack (authenticated).
 * Shows a splash/loading screen while the initial auth state resolves.
 */
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from '../services/authService';
import { setUser } from '../store/slices/authSlice';
import { clearTasks } from '../store/slices/tasksSlice';
import { RootState, AppDispatch } from '../store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { Colors } from '../assets/theme';

const RootNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, initialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Subscribe to Firebase auth state changes.
    // Returns an unsubscribe function that we call on unmount.
    const unsubscribe = onAuthStateChanged(authUser => {
      dispatch(setUser(authUser));
      // Clear cached tasks when user logs out
      if (!authUser) {
        dispatch(clearTasks());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  // Show loading indicator until Firebase resolves the initial auth state
  if (!initialized) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
