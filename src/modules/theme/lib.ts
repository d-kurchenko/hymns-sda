import type { ColorMode } from './model';
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area';
import { COLOR_SCHEME } from './model/constants';

export function syncSafeAreaContentColor(activeColorMode: ColorMode) {
  SafeArea.setSystemBarsStyle({
    style: activeColorMode === COLOR_SCHEME.DARK ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
  });
}
