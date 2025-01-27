import type { ColorMode } from './model';
import { SafeArea } from '@capacitor-community/safe-area';

export function syncSafeAreaContentColor(activeColorMode: ColorMode) {
  SafeArea.enable({
    config: {
      customColorsForSystemBars: true,
      statusBarColor: '#00000000',
      navigationBarColor: '#00000000',
      statusBarContent: activeColorMode === 'dark' ? 'light' : 'dark',
      navigationBarContent: activeColorMode === 'dark' ? 'light' : 'dark',
    },
  });
}
