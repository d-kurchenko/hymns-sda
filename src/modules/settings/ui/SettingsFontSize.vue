<script setup lang="ts">
import { ui } from 'beercss/loader';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from 'src/modules/book/model/constants';
import { onMounted, onUpdated } from 'vue';
import { useSettings } from '../model';

const fontSize = useSettings().setting('fontSize');

// Initialize before the first paint instead of waiting for BeerCSS's observer.
onMounted(() => ui());
onUpdated(() => ui());
</script>

<template>
  <div class="tw:flex tw:flex-col tw:gap-3">
    <div class="tw:flex tw:justify-between tw:items-center tw:gap-3">
      <label for="settings-font-size">{{ $t('settings.fontSize') }}</label>
      <output
        for="settings-font-size"
        class="tw:text-(--primary) tw:tabular-nums"
      >{{ fontSize }}</output>
    </div>
    <label class="slider tw:m-0!">
      <input
        id="settings-font-size"
        v-model.number="fontSize"
        type="range"
        :min="MIN_FONT_SIZE"
        :max="MAX_FONT_SIZE"
        step="1"
      >
      <span />
    </label>
    <div class="tw:rounded-xl tw:p-4 tw:bg-(--surface-container) tw:overflow-hidden">
      <p
        class="tw:text-center tw:leading-tight tw:break-words"
        :style="{ fontSize: `${fontSize * 1.875}px` }"
      >
        {{ $t('settings.preview') }}
      </p>
    </div>
  </div>
</template>
