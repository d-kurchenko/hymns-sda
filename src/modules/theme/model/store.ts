import { defineStore } from 'pinia';
import { useLocalStorage, usePreferredColorScheme, watchImmediate } from '@vueuse/core';
import { computed } from 'vue';
import { localStorageModel } from 'src/modules/local-storage';
import { colorSchemes } from './constants';
import type { ColorScheme } from './types';

export const useThemeStore = defineStore('theme', () => {
  const _preferredColorScheme = usePreferredColorScheme();
  const preferredColorScheme = computed<ColorScheme>(() => _preferredColorScheme.value === 'no-preference' ? 'light' : _preferredColorScheme.value);

  const colorSchemeStorage = useLocalStorage(localStorageModel.LocalStorageKey.COLOR_SCHEME, preferredColorScheme.value);

  watchImmediate(colorSchemeStorage, (value) => {
    if (!(colorSchemes).includes(value as any)) {
      setTimeout(() => {
        colorSchemeStorage.value = preferredColorScheme.value;
      });
    }
  });

  const colorScheme = computed<ColorScheme>({
    get: () => {
      if (!colorSchemes.includes(colorSchemeStorage.value as any))
        return preferredColorScheme.value;
      else
        return colorSchemeStorage.value as ColorScheme;
    },
    set: value => colorSchemeStorage.value = value,
  });

  const setPreferredColorScheme = () => {
    colorScheme.value = preferredColorScheme.value;
  };

  const toggleColorScheme = (_colorScheme?: ColorScheme | 'preferred') => {
    if (_colorScheme) {
      if (_colorScheme === 'preferred')
        setPreferredColorScheme();
      else
        colorScheme.value = _colorScheme;

      return;
    }

    colorScheme.value = colorScheme.value === 'dark' ? 'light' : 'dark';
  };

  return {
    preferredColorScheme,
    colorScheme,
    toggleColorScheme,
    setPreferredColorScheme,
  };
});
