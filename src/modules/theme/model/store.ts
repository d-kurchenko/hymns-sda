import type { ColorScheme } from './types';
import { SafeArea } from '@capacitor-community/safe-area';
import { createSharedComposable, useLocalStorage, usePreferredColorScheme, watchImmediate } from '@vueuse/core';
import { localStorageModel } from 'src/modules/local-storage';
import { computed, watch } from 'vue';

type ColorMode = 'dark' | 'light';
type ColorSchemeClass = Exclude<ColorScheme, 'preferred'>;

function setThemeClass(className: ColorSchemeClass) {
  if (className === 'light')
    ui('mode', 'light');
  else
    ui('mode', 'dark');
}

function syncSafeAreaContentColor(activeColorMode: ColorMode) {
  SafeArea.enable({
    config: {
      statusBarContent: activeColorMode === 'dark' ? 'light' : 'dark',
      navigationBarContent: activeColorMode === 'dark' ? 'light' : 'dark',
    },
  });
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
