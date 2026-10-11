import type { Serializer } from '@vueuse/core';
import type { Settings } from './schema';
import { localStorageModel } from 'src/modules/local-storage';
import { z } from 'zod';
import { SETTINGS_VERSION, settingsMigrations } from './migrations';
import { recoverSettings } from './schema';

const snapshotSchema = z.object({
  version: z.number().int().nonnegative(),
  settings: z.record(z.string(), z.unknown()),
});

function migrateSettings(value: unknown): Settings {
  const { version, settings } = snapshotSchema.parse(value);
  if (version > SETTINGS_VERSION)
    throw new Error(`Unsupported settings version: ${version}`);

  const migrated = settingsMigrations.slice(version)
    .reduce((data, migrate) => migrate(data), settings);
  return recoverSettings(migrated);
}

export const settingsSerializer: Serializer<Settings> = {
  read: value => migrateSettings(JSON.parse(value)),
  write: settings => JSON.stringify({ version: SETTINGS_VERSION, settings }),
};

export function migrateSettingsStorage() {
  try {
    const key = localStorageModel.LocalStorageKey.SETTINGS;
    const raw = localStorage.getItem(key);
    if (raw === null)
      return;

    const settings = settingsSerializer.read(raw);
    const upgraded = settingsSerializer.write(settings);
    if (upgraded !== raw)
      localStorage.setItem(key, upgraded);
  }
  catch (error) {
    console.error('Failed to migrate settings', error);
  }
}
