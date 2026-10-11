<script setup lang="ts">
import RestartAltIcon from '@material-design-icons/svg/filled/restart_alt.svg?component';
import { useSettings } from '../model';
import SettingsSection from './SettingsSection.vue';

const { isDefault, reset } = useSettings();
</script>

<template>
  <SettingsSection title="settings.reset">
    <p class="tw:text-sm tw:text-(--on-surface-variant)">
      {{ $t('settings.reset.description') }}
    </p>
    <button
      type="button"
      class="border ripple tw:m-0! tw:self-start"
      :disabled="isDefault"
      @click="reset()"
    >
      <i aria-hidden="true"><RestartAltIcon /></i>
      <span>{{ $t('settings.reset') }}</span>
    </button>
  </SettingsSection>
</template>
