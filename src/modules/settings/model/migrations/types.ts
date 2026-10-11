export type SettingsData = Record<string, unknown>;
export type SettingsMigration = (_settings: SettingsData) => SettingsData;
