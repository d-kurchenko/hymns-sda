import type { LocaleCode } from './constants';
import { watchImmediate } from '@vueuse/core';
import { createI18n } from 'petite-vue-i18n';
import { settingsModel } from 'src/modules/settings';
import { LOCALE, SUPPORTED_LOCALE_CODES } from './constants';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

type MessageSchema = typeof en;

export async function initI18n() {
  const { Device } = await import('@capacitor/device');
  const { value: localeCode } = await Device.getLanguageCode();
  const systemLocale = SUPPORTED_LOCALE_CODES.find(code => code === localeCode) ?? LOCALE.EN;
  const locale = settingsModel.useSettings().setting('locale');

  const i18n = createI18n<[MessageSchema], LocaleCode>({
    locale: locale.value === LOCALE.SYSTEM ? systemLocale : locale.value,
    fallbackLocale: LOCALE.EN,
    messages: {
      en,
      ru,
      uk,
    },
  });

  watchImmediate(locale, (value) => {
    const activeLocale = value === LOCALE.SYSTEM ? systemLocale : value;
    i18n.global.locale.value = activeLocale;
    document.documentElement.lang = activeLocale;
  });

  return i18n;
}

declare module 'petite-vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}
