import type { ColorMode, ColorScheme } from './types';
import { createSharedComposable, useLocalStorage, usePreferredColorScheme, watchImmediate } from '@vueuse/core';
import { ui } from 'beercss/scoped';
import { localStorageModel } from 'src/modules/local-storage';
import { computed, watch } from 'vue';
import { syncSafeAreaContentColor } from '../lib';

type ColorSchemeClass = Exclude<ColorScheme, 'preferred'>;

function setThemeClass(className: ColorSchemeClass) {
  if (className === 'light')
    ui('mode', 'light');
  else
    ui('mode', 'dark');
}

export const useThemeStore = createSharedComposable(() => {
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

  const activeColorMode = computed<ColorMode>(() => colorScheme.value === 'preferred' ? preferredColorScheme.value : colorScheme.value);

  watch(preferredColorScheme, () => {
    if (colorScheme.value === 'preferred')
      setThemeClass(preferredColorScheme.value);

    syncSafeAreaContentColor(activeColorMode.value);
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

    syncSafeAreaContentColor(activeColorMode.value);
  });

  return {
    preferredColorScheme,
    activeColorMode,
    colorScheme,
    toggleColorScheme,
  };
});
