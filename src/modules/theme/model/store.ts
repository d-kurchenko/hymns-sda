import type { ColorScheme } from './types';
import { useLocalStorage, usePreferredColorScheme, watchImmediate } from '@vueuse/core';
import { defineStore } from 'pinia';
import { localStorageModel } from 'src/modules/local-storage';
import { computed, watch } from 'vue';

type ColorSchemeClass = Exclude<ColorScheme, 'preferred'>;
function setThemeClass(className: ColorSchemeClass) {
  if (className === 'light')
    document.documentElement.classList.remove('dark' as ColorSchemeClass);
  else
    document.documentElement.classList.add('dark' as ColorSchemeClass);
}

export const useThemeStore = defineStore('theme', () => {
  const _preferredColorScheme = usePreferredColorScheme();
  const preferredColorScheme = computed(() => _preferredColorScheme.value === 'no-preference' ? 'light' : _preferredColorScheme.value);

  const colorSchemeStorage = useLocalStorage<ColorScheme>(
    localStorageModel.LocalStorageKey.COLOR_SCHEME,
    'preferred',
  );

  const colorScheme = computed<ColorScheme>({
    get: () => colorSchemeStorage.value,
    set: value => colorSchemeStorage.value = value,
  });

  watch(preferredColorScheme, () => {
    if (colorScheme.value === 'preferred')
      setThemeClass(preferredColorScheme.value);
  });

  const toggleColorScheme = (_colorScheme?: ColorScheme) => {
    if (_colorScheme) {
      colorScheme.value = _colorScheme;
      return;
    }

    if (colorScheme.value === 'light')
      colorScheme.value = 'dark';
    else if (colorScheme.value === 'dark')
      colorScheme.value = 'preferred';
    else
      colorScheme.value = 'light';
  };

  watchImmediate(colorScheme, (value) => {
    if (value === 'dark' || value === 'light')
      setThemeClass(value);
    else if (value === 'preferred')
      setThemeClass(preferredColorScheme.value);
  });

  return {
    preferredColorScheme,
    colorScheme,
    toggleColorScheme,
  };
});
