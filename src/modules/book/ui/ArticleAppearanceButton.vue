<script setup lang="ts">
import FormatPaintIcon from '@material-design-icons/svg/outlined/format_paint.svg?component';
import TextDecreaseIcon from '@material-design-icons/svg/outlined/text_decrease.svg?component';
import TextIncreaseIcon from '@material-design-icons/svg/outlined/text_increase.svg?component';
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';
import { bookLib, bookModel } from '..';

const { fontSize } = bookLib.useArticleAppearance();
const isOpen = ref(false);
const control = useTemplateRef('control');
const button = useTemplateRef('button');

onClickOutside(control, () => isOpen.value = false);

function closeMenu() {
  isOpen.value = false;
  button.value?.focus({ preventScroll: true });
}
</script>

<template>
  <div
    ref="control"
    class="tw:relative"
    data-ui
    @keydown.esc.stop.prevent="closeMenu"
  >
    <button
      ref="button"
      type="button"
      class="transparent circle ripple"
      :aria-label="$t('settings.fontSize')"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      aria-controls="article-appearance-menu"
      @click="isOpen = !isOpen"
      @keydown.down.prevent="isOpen = true"
    >
      <i><FormatPaintIcon /></i>
    </button>

    <menu
      id="article-appearance-menu"
      class="no-wrap left right-align tw:overflow-visible"
      :class="{ active: isOpen }"
      role="menu"
      :aria-label="$t('settings.fontSize')"
      :aria-hidden="!isOpen"
    >
      <li class="tw:gap-0 hover:tw:bg-inherit tw:cursor-default">
        <i><TextDecreaseIcon /></i>
        <label class="slider small">
          <span />
          <input
            v-model.number="fontSize"
            type="range"
            :aria-label="$t('settings.fontSize')"
            :min="bookModel.MIN_FONT_SIZE"
            :max="bookModel.MAX_FONT_SIZE"
          >
          <div class="tooltip" />
        </label>
        <i><TextIncreaseIcon /></i>
      </li>
    </menu>
  </div>
</template>
