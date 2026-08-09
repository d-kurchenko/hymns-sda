import type { ColorMode } from './model';
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area';

export function syncSafeAreaContentColor(activeColorMode: ColorMode) {
  SafeArea.setSystemBarsStyle({
    style: activeColorMode === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
  });
}
