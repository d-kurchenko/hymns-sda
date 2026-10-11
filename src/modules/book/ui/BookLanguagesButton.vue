<script setup lang="ts">
import type { BookLanguage } from '../model';
import CheckIcon from '@material-design-icons/svg/filled/check.svg?component';
import FilterListIcon from '@material-design-icons/svg/filled/filter_list.svg?component';
import { onClickOutside } from '@vueuse/core';
import { useSettings } from 'src/modules/settings/model';
import { computed, nextTick, onDeactivated, ref, useId, useTemplateRef } from 'vue';
import { BOOK_LANGUAGE_OPTIONS, BOOK_LANGUAGES } from '../model/constants';

defineProps<{ alignEnd?: boolean, iconOnly?: boolean }>();

const languages = useSettings().setting('bookLanguages');
const isOpen = ref(false);
const control = useTemplateRef('control');
const button = useTemplateRef('button');
const menu = useTemplateRef('menu');
const menuId = useId();
const activeIndex = ref(0);
const label = computed(() => languages.value.length === BOOK_LANGUAGES.length
  ? 'books.languages.all'
  : `settings.language.${languages.value[0]}`);

onClickOutside(control, () => isOpen.value = false);
onDeactivated(() => isOpen.value = false);

function focusItem() {
  menu.value?.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')[activeIndex.value]?.focus({ preventScroll: true });
}

function focusMenu() {
  if (isOpen.value && !menu.value?.contains(document.activeElement))
    focusItem();
}

async function openMenu() {
  activeIndex.value = BOOK_LANGUAGE_OPTIONS.findIndex(option => languages.value.includes(option.value));
  isOpen.value = true;
  await nextTick();
  focusItem();
}

function closeMenu() {
  isOpen.value = false;
  button.value?.focus({ preventScroll: true });
}

function isOnlySelected(language: BookLanguage) {
  return languages.value.length === 1 && languages.value.includes(language);
}

function toggleLanguage(language: BookLanguage) {
  if (isOnlySelected(language))
    return;

  languages.value = languages.value.includes(language)
    ? languages.value.filter(value => value !== language)
    : [...languages.value, language];
}

function navigateMenu(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      activeIndex.value = (activeIndex.value + 1) % BOOK_LANGUAGE_OPTIONS.length;
      break;
    case 'ArrowUp':
      activeIndex.value = (activeIndex.value - 1 + BOOK_LANGUAGE_OPTIONS.length) % BOOK_LANGUAGE_OPTIONS.length;
      break;
    case 'Home':
      activeIndex.value = 0;
      break;
    case 'End':
      activeIndex.value = BOOK_LANGUAGE_OPTIONS.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  focusItem();
}

function onFocusOut(event: FocusEvent) {
  if (!control.value?.contains(event.relatedTarget as Node | null))
    isOpen.value = false;
}
</script>

<template>
  <div
    ref="control"
    class="tw:relative tw:self-start"
    :class="{ 'tw:z-20': isOpen }"
    data-ui
    @keydown.esc.stop.prevent="closeMenu"
    @focusout="onFocusOut"
  >
    <button
      ref="button"
      type="button"
      class="transparent ripple tw:m-0!"
      :class="{ 'circle': iconOnly, 'border blur': !iconOnly, 'primary-text primary-border': !iconOnly && languages.length < BOOK_LANGUAGES.length }"
      :aria-label="`${$t('books.languages')}: ${$t(label)}`"
      :title="$t('books.languages')"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      @click="isOpen ? closeMenu() : openMenu()"
      @keydown.down.prevent="openMenu"
      @keydown.up.prevent="openMenu"
    >
      <i aria-hidden="true"><FilterListIcon /></i>
      <span v-if="!iconOnly">{{ $t(label) }}</span>
    </button>

    <menu
      :id="menuId"
      ref="menu"
      class="no-wrap tw:mt-2 tw:min-w-52"
      :class="{ active: isOpen, left: alignEnd, right: !alignEnd }"
      role="menu"
      :aria-label="$t('books.languages')"
      :aria-hidden="!isOpen"
      @keydown="navigateMenu"
      @transitionend.self="focusMenu"
    >
      <li
        v-for="(option, index) in BOOK_LANGUAGE_OPTIONS"
        :key="option.value"
        class="ripple"
        :class="{ 'active': languages.includes(option.value), 'tw:opacity-60 tw:cursor-default!': isOnlySelected(option.value) }"
        role="menuitemcheckbox"
        :tabindex="isOpen && activeIndex === index ? 0 : -1"
        :aria-checked="languages.includes(option.value)"
        :aria-disabled="isOnlySelected(option.value)"
        @focus="activeIndex = index"
        @click="toggleLanguage(option.value)"
        @keydown.enter.prevent="toggleLanguage(option.value)"
        @keydown.space.prevent="toggleLanguage(option.value)"
      >
        <span class="tw:flex-1">{{ $t(option.label) }}</span>
        <i
          aria-hidden="true"
          :class="{ 'tw:opacity-0': !languages.includes(option.value) }"
        ><CheckIcon /></i>
      </li>
    </menu>
  </div>
</template>
