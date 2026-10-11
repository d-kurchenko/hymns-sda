<script setup lang="ts">
import { SettingsAbout, SettingsAppearance, SettingsBooks, SettingsReset } from 'src/modules/settings';
import ScrollPage from 'src/shared/ui/ScrollPage.vue';

const sections = [
  { id: 'appearance', component: SettingsAppearance },
  { id: 'books', component: SettingsBooks },
  { id: 'reset', component: SettingsReset },
  { id: 'about', component: SettingsAbout },
];
</script>

<template>
  <ScrollPage :show-scroll-to-top="false">
    <div class="tw:w-full tw:max-w-2xl tw:mx-auto tw:flex tw:flex-col tw:gap-6">
      <div>
        <h1 class="tw:text-2xl tw:font-bold">
          {{ $t('navigation.settings') }}
        </h1>
        <p class="tw:mt-2 tw:text-sm tw:text-(--on-surface-variant)">
          {{ $t('settings.description') }}
        </p>
      </div>
      <template
        v-for="(section, index) in sections"
        :key="section.id"
      >
        <hr
          v-if="index > 0"
          class="tw:m-0!"
        >
        <component :is="section.component" />
      </template>
    </div>
  </ScrollPage>
</template>
