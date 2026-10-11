<script setup lang="ts">
import OpenInNewIcon from '@material-design-icons/svg/filled/open_in_new.svg?component';
import packageJson from '../../../../package.json';
import SettingsSection from './SettingsSection.vue';

const version = packageJson.version;
</script>

<template>
  <SettingsSection title="settings.about">
    <p class="tw:w-fit tw:rounded-full tw:bg-(--surface-container-high) tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-(--on-surface-variant) tw:tabular-nums">
      {{ $t('settings.version', [version]) }}
    </p>
    <a
      class="row ripple tw:rounded-none! tw:p-3 tw:bg-(--surface-container-high)"
      href="https://github.com/d-kurchenko/hymns-sda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="max">{{ $t('settings.github') }}</span>
      <i aria-hidden="true"><OpenInNewIcon /></i>
    </a>
  </SettingsSection>
</template>
