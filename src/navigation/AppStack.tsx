/**
 * AppStack — Bottom tab navigator for authenticated users
 *
 * Tabs: Home, AddTask (center FAB-style), Profile
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Radius, Shadow, Spacing } from '../assets/theme';

export type AppTabParamList = {
  Home: undefined;
  AddTask: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
// We render a minimal glassmorphism tab bar with a prominent center AddTask button

const CustomTabBar: React.FC<{
  state: { index: number; routes: Array<{ key: string; name: string }> };
  navigation: { navigate: (name: string) => void };
}> = ({ state, navigation }) => {
  const tabs = state.routes;

  const icons: Record<string, string> = {
    Home: '🏠',
    AddTask: '＋',
    Profile: '👤',
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'AddTask';
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, isCenter && styles.centerTab]}>
            {isCenter ? (
              <View style={styles.fabCircle}>
                <Text style={styles.fabIcon}>{icons[route.name]}</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                  {icons[route.name]}
                </Text>
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {route.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AppStack: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { color: Colors.textPrimary, fontWeight: '700' },
        headerTintColor: Colors.accent,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '⚡ TaskForge' }} />
      <Tab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: 'New Task', presentation: 'modal' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  centerTab: {
    justifyContent: 'flex-start',
    paddingTop: 0,
    marginTop: -Spacing.lg,
  },
  fabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  fabIcon: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '700',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
