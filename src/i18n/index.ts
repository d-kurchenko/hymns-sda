import { createI18n } from 'petite-vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

const supportedLocaleCodes = ['en', 'ru', 'uk'] as const;

type LocaleCode = typeof supportedLocaleCodes[number];

type MessageSchema = typeof en;

export async function initI18n() {
  const { Device } = await import('@capacitor/device');
  const { value: localeCode } = await Device.getLanguageCode();
  const locale: LocaleCode
  = supportedLocaleCodes.includes(localeCode as any) ? localeCode as LocaleCode : 'en';

  const i18n = createI18n<[MessageSchema], LocaleCode>({
    locale,
    fallbackLocale: 'en',
    messages: {
      en,
      ru,
      uk,
    },
  });

  return i18n;
}

declare module 'petite-vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}
