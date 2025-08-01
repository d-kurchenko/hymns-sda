<script setup lang="ts">
import FormatPaintIcon from '@material-design-icons/svg/outlined/format_paint.svg?component';
import TextDecreaseIcon from '@material-design-icons/svg/outlined/text_decrease.svg?component';
import TextIncreaseIcon from '@material-design-icons/svg/outlined/text_increase.svg?component';
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';
import { bookLib, bookModel } from '..';

const { fontSize } = bookLib.useArticleAppearance();
const isActive = ref(false);
const menu = useTemplateRef('menu');
onClickOutside(menu, () => isActive.value = false);
</script>

<template>
  <button
    class="transparent circle ripple"
    data-ui="#menu"
  >
    <i><FormatPaintIcon /></i>

    <menu
      id="menu"
      ref="menu"
      :class="{ active: isActive }"
      class="bottom tw:top-10 no-wrap left right-align tw:overflow-visible"
    >
      <li class="tw:gap-0 hover:tw:bg-inherit tw:cursor-default">
        <i><TextDecreaseIcon /></i>
        <label class="slider small">
          <span />
          <input
            v-model="fontSize"
            type="range"
            :min="bookModel.MIN_FONT_SIZE"
            :max="bookModel.MAX_FONT_SIZE"
          >
          <div class="tooltip" />
        </label>
        <i><TextIncreaseIcon /></i>
      </li>
    </menu>
  </button>
</template>
