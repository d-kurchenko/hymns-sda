<script setup lang="ts">
import KeyboardArrowUpIcon from '@material-design-icons/svg/filled/keyboard_arrow_up.svg?component';
import { providePageScroll } from '../page-scroll';

const props = withDefaults(defineProps<{ showScrollToTop?: boolean }>(), {
  showScrollToTop: false,
});

const { element, y, onScroll, scrollToTop } = providePageScroll();
</script>

<template>
  <section class="page-transition-wrapper">
    <div
      ref="element"
      class="page-scroll"
      tabindex="0"
      @scroll.passive="onScroll"
    >
      <div class="page-content">
        <slot />
      </div>
    </div>
    <Transition
      v-if="props.showScrollToTop"
      name="scroll-to-top"
    >
      <button
        v-show="y >= 300"
        class="border circle extra large-elevate secondary-border secondary-text blur ripple tw:absolute tw:right-5 tw:bottom-5 tw:z-20"
        :aria-label="$t('common.scrollToTop')"
        @click.prevent.stop="scrollToTop('smooth')"
      >
        <i><KeyboardArrowUpIcon /></i>
      </button>
    </Transition>
  </section>
</template>
