export const LOCALE = {
  SYSTEM: 'system',
  EN: 'en',
  RU: 'ru',
  UK: 'uk',
} as const;

export type InterfaceLocale = typeof LOCALE[keyof typeof LOCALE];
export type LocaleCode = Exclude<InterfaceLocale, typeof LOCALE.SYSTEM>;

export const SUPPORTED_LOCALE_CODES = [LOCALE.EN, LOCALE.RU, LOCALE.UK] as const;

export const INTERFACE_LANGUAGE_OPTIONS = [
  { value: LOCALE.SYSTEM, label: 'settings.system' },
  { value: LOCALE.UK, label: 'settings.language.uk' },
  { value: LOCALE.RU, label: 'settings.language.ru' },
  { value: LOCALE.EN, label: 'settings.language.en' },
] as const;
