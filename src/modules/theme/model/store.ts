import type { ColorMode, ColorScheme } from './types';
import { createSharedComposable, usePreferredColorScheme, watchImmediate } from '@vueuse/core';
import { ui } from 'beercss/loader';
import { settingsModel } from 'src/modules/settings';
import { computed } from 'vue';
import { syncSafeAreaContentColor } from '../lib';
import { COLOR_SCHEME, COLOR_SCHEME_OPTIONS } from './constants';
import 'beercss/dist/cdn/settings/theme.js';
import 'beercss/dist/cdn/helpers/ripple.js';
import 'beercss/dist/cdn/elements/field.js';
import 'beercss/dist/cdn/elements/menu.js';
import 'beercss/dist/cdn/elements/slider.js';

export const useThemeStore = createSharedComposable(() => {
  const _preferredColorScheme = usePreferredColorScheme();
  const preferredColorScheme = computed(() => _preferredColorScheme.value === 'no-preference' ? COLOR_SCHEME.LIGHT : _preferredColorScheme.value);

  const colorScheme = settingsModel.useSettings().setting('colorScheme');

  const activeColorMode = computed<ColorMode>(() => colorScheme.value === COLOR_SCHEME.SYSTEM ? preferredColorScheme.value : colorScheme.value);

  const toggleColorScheme = (_colorScheme?: ColorScheme) => {
    if (_colorScheme) {
      colorScheme.value = _colorScheme;
      return;
    }

    const index = COLOR_SCHEME_OPTIONS.findIndex(option => option.value === colorScheme.value);
    colorScheme.value = COLOR_SCHEME_OPTIONS[(index + 1) % COLOR_SCHEME_OPTIONS.length]!.value;
  };

  watchImmediate(activeColorMode, (value) => {
    ui('mode', value);
    syncSafeAreaContentColor(value);
  });

  return {
    preferredColorScheme,
    activeColorMode,
    colorScheme,
    toggleColorScheme,
  };
});
