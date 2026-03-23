// ─── TaskForge Design System ─────────────────────────────────────────────────
// Dark Glassmorphism + Neon Accent palette

export const Colors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#13131A',
  card: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.10)',

  // Accents
  accent: '#6C63FF',        // electric violet
  accentSecondary: '#FF6584', // neon pink

  // Semantic
  success: '#43E97B',
  warning: '#F7971E',
  danger: '#FF4B6E',

  // Text
  textPrimary: '#F0F0FF',
  textSecondary: '#8888AA',

  // Priority colours
  priorityHigh: '#FF4B6E',
  priorityMedium: '#F7971E',
  priorityLow: '#43E97B',

  // Utility
  white: '#FFFFFF',
  transparent: 'transparent',
  inputBg: '#1A1A25',
  divider: 'rgba(255,255,255,0.07)',
};

export const Gradients = {
  accent: [Colors.accent, Colors.accentSecondary] as [string, string],
  success: ['#43E97B', '#38F9D7'] as [string, string],
  danger: [Colors.danger, '#FF8C42'] as [string, string],
  surface: [Colors.surface, Colors.background] as [string, string],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    color: Colors.textPrimary,
  },
  displayMedium: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  titleLarge: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
};

export const Shadow = {
  card: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
};
