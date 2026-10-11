<script setup lang="ts">
import OpenInNewIcon from '@material-design-icons/svg/filled/open_in_new.svg?component';
import SettingsSection from './SettingsSection.vue';
</script>

<template>
  <SettingsSection title="settings.about">
    <p class="tw:text-sm tw:text-(--on-surface-variant)">
      {{ $t('settings.about.description') }}
    </p>
    <a
      class="row ripple tw:rounded-lg tw:p-3 tw:bg-(--surface-container)"
      href="https://github.com/d-kurchenko/hymns-sda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="max">{{ $t('settings.github') }}</span>
      <i aria-hidden="true"><OpenInNewIcon /></i>
    </a>
  </SettingsSection>
</template>
