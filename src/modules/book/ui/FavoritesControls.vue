<script setup lang="ts">
import type { FavoriteSort } from '../model';
import CheckIcon from '@material-design-icons/svg/filled/check.svg?component';
import SortIcon from '@material-design-icons/svg/filled/sort.svg?component';
import { onClickOutside, useMediaQuery } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';
import { useFavorites } from '../lib';
import { FAVORITE_SORT_OPTIONS, FAVORITE_VIEW_OPTIONS } from '../model';

const { view, sort } = useFavorites();
const isOpen = ref(false);
const isCompact = useMediaQuery('(max-width: 480px)');
const sortControl = useTemplateRef('sortControl');
const sortButton = useTemplateRef('sortButton');
const sortMenu = useTemplateRef('sortMenu');

onClickOutside(sortControl, () => isOpen.value = false);

function focusMenu() {
  if (isOpen.value && !sortMenu.value?.contains(document.activeElement))
    sortMenu.value?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
}

function closeMenu() {
  isOpen.value = false;
  sortButton.value?.focus({ preventScroll: true });
}

function selectSort(value: FavoriteSort) {
  sort.value = value;
  closeMenu();
}

function navigateMenu(event: KeyboardEvent) {
  const items = [...sortMenu.value!.querySelectorAll<HTMLElement>('[role="menuitemradio"]')];
  const index = items.indexOf(document.activeElement as HTMLElement);
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  }
}
</script>

<template>
  <div class="tw:flex tw:justify-between tw:items-center tw:gap-3">
    <nav
      class="group connected border round blur tw:p-1"
      role="group"
      :aria-label="$t('favorites.view')"
    >
      <button
        v-for="option in FAVORITE_VIEW_OPTIONS"
        :key="option.value"
        type="button"
        class="ripple"
        :class="{ active: view === option.value, transparent: view !== option.value }"
        :aria-pressed="view === option.value"
        @click="view = option.value"
      >
        {{ $t(option.label) }}
      </button>
    </nav>

    <div
      ref="sortControl"
      class="tw:relative"
      data-ui
      @keydown.esc.stop.prevent="closeMenu"
    >
      <button
        ref="sortButton"
        type="button"
        class="transparent border blur ripple tw:m-0!"
        :class="{ circle: isCompact }"
        :aria-label="$t('favorites.sort')"
        aria-haspopup="menu"
        :aria-expanded="isOpen"
        :title="$t(`favorites.sort.${sort}`)"
        @click="isOpen = !isOpen"
        @keydown.down.prevent="isOpen = true"
      >
        <i><SortIcon /></i>
        <span>{{ $t(`favorites.sort.${sort}`) }}</span>
      </button>

      <menu
        ref="sortMenu"
        class="left no-wrap tw:min-w-52"
        :class="{ active: isOpen }"
        role="menu"
        :aria-label="$t('favorites.sort')"
        :aria-hidden="!isOpen"
        @keydown="navigateMenu"
        @transitionend.self="focusMenu"
      >
        <li
          v-for="option in FAVORITE_SORT_OPTIONS"
          :key="option.value"
          class="ripple"
          :class="{ active: sort === option.value }"
          role="menuitemradio"
          tabindex="0"
          :aria-checked="sort === option.value"
          @click="selectSort(option.value)"
          @keydown.enter.prevent="selectSort(option.value)"
          @keydown.space.prevent="selectSort(option.value)"
        >
          <span class="tw:flex-1">{{ $t(option.label) }}</span>
          <i :class="{ 'tw:opacity-0': sort !== option.value }"><CheckIcon /></i>
        </li>
      </menu>
    </div>
  </div>
</template>
