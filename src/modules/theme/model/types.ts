import type { COLOR_SCHEME } from './constants';

export type ColorScheme = typeof COLOR_SCHEME[keyof typeof COLOR_SCHEME];
export type ColorMode = Exclude<ColorScheme, typeof COLOR_SCHEME.SYSTEM>;
