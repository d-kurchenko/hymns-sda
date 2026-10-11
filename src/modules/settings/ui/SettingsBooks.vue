<script setup lang="ts">
import BookLanguagesButton from 'src/modules/book/ui/BookLanguagesButton.vue';
import SettingsSection from './SettingsSection.vue';
</script>

<template>
  <SettingsSection title="settings.books">
    <p class="tw:text-sm tw:text-(--on-surface-variant)">
      {{ $t('settings.books.description') }}
    </p>
    <BookLanguagesButton />
  </SettingsSection>
</template>
