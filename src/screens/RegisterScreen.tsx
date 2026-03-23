/**
 * RegisterScreen — Email + password + confirm password registration with validation
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import AuthInput from '../components/AuthInput';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';
import { Colors, Spacing, Typography } from '../assets/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Clear Redux error when the user edits any field
  useEffect(() => {
    if (error) clearError();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, confirmPassword]);

  const validate = (): boolean => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(password, confirmPassword);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);
    return !eErr && !pErr && !cErr;
  };

  const handleRegister = () => {
    if (!validate()) return;
    register(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚡ TaskForge</Text>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>
            Get started — it only takes a moment
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            placeholder="Min. 6 characters"
          />
          <AuthInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmError}
            secureTextEntry
            placeholder="Re-enter your password"
          />

          {error ? <Text style={styles.authError}>{error}</Text> : null}

          <GradientButton
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />
        </View>

        {/* Navigate to login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.displayMedium,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.sm,
  },
  authError: {
    ...Typography.body,
    color: Colors.danger,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    ...Typography.body,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '700',
  },
});
