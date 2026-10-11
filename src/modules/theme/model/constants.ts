export const COLOR_SCHEME = {
  SYSTEM: 'preferred',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const COLOR_SCHEME_OPTIONS = [
  { value: COLOR_SCHEME.SYSTEM, label: 'settings.system' },
  { value: COLOR_SCHEME.LIGHT, label: 'settings.theme.light' },
  { value: COLOR_SCHEME.DARK, label: 'settings.theme.dark' },
] as const;
