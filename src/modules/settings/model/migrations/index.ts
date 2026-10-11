import type { SettingsMigration } from './types';
import { v1 } from './v1';

export const settingsMigrations: readonly SettingsMigration[] = [v1];
export const SETTINGS_VERSION = settingsMigrations.length;
