import type { Settings } from './schema';
import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { localStorageModel } from 'src/modules/local-storage';
import { computed, readonly } from 'vue';
import { defaultSettings, settingsSchema } from './schema';
import { migrateSettingsStorage, settingsSerializer } from './storage';

export const useSettings = createSharedComposable(() => {
  migrateSettingsStorage();

  const storedSettings = useLocalStorage<Settings>(
    localStorageModel.LocalStorageKey.SETTINGS,
    { ...defaultSettings },
    { serializer: settingsSerializer, flush: 'sync' },
  );

  const isDefault = computed(() => (Object.keys(defaultSettings) as (keyof Settings)[])
    .every(key => storedSettings.value[key] === defaultSettings[key]));

  function patch(values: Partial<Settings>) {
    storedSettings.value = settingsSchema.parse({ ...storedSettings.value, ...values });
  }

  function set<K extends keyof Settings>(key: K, value: NoInfer<Settings[K]>) {
    patch({ [key]: value });
  }

  function reset(key?: keyof Settings) {
    if (key)
      patch({ [key]: defaultSettings[key] });
    else
      storedSettings.value = { ...defaultSettings };
  }

  function setting<K extends keyof Settings>(key: K) {
    return computed<Settings[K]>({
      get: () => storedSettings.value[key],
      set: value => set(key, value),
    });
  }

  return { settings: readonly(storedSettings), isDefault, setting, set, patch, reset };
});
