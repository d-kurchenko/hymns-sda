import type { SettingsMigration } from './types';

// The initial format needs no conversion; defaults come from the current schema.
export const v1: SettingsMigration = settings => settings;
