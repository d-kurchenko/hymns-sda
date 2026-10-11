<script setup lang="ts">
import { INTERFACE_LANGUAGE_OPTIONS } from 'src/i18n/constants';
import { COLOR_SCHEME_OPTIONS } from 'src/modules/theme/model/constants';
import { useSettings } from '../model';
import SettingsFontSize from './SettingsFontSize.vue';
import SettingsSection from './SettingsSection.vue';
import SettingsSelect from './SettingsSelect.vue';

const { setting } = useSettings();
const colorScheme = setting('colorScheme');
const locale = setting('locale');
</script>

<template>
  <SettingsSection title="settings.appearance">
    <SettingsSelect
      id="settings-theme"
      v-model="colorScheme"
      label="settings.theme"
      :options="COLOR_SCHEME_OPTIONS"
    />
    <SettingsSelect
      id="settings-language"
      v-model="locale"
      label="settings.language"
      :options="INTERFACE_LANGUAGE_OPTIONS"
    />
    <SettingsFontSize />
  </SettingsSection>
</template>
