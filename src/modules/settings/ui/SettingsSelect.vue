<script setup lang="ts" generic="T extends string">
import CheckIcon from '@material-design-icons/svg/filled/check.svg?component';
import ExpandMoreIcon from '@material-design-icons/svg/filled/expand_more.svg?component';
import { onClickOutside } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

const props = defineProps<{
  id: string
  label: string
  options: readonly { value: T, label: string }[]
}>();

const model = defineModel<T>({ required: true });
const control = useTemplateRef('control');
const isOpen = ref(false);
const activeIndex = ref(0);
const selectedOption = computed(() => props.options.find(option => option.value === model.value));

onClickOutside(control, () => isOpen.value = false);

function openMenu() {
  activeIndex.value = Math.max(0, props.options.findIndex(option => option.value === model.value));
  isOpen.value = true;
}

function select(value: T) {
  model.value = value;
  isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' || event.key === 'Tab') {
    isOpen.value = false;
    return;
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key))
    return;

  event.preventDefault();
  if (!isOpen.value) {
    openMenu();
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      activeIndex.value = (activeIndex.value + 1) % props.options.length;
      break;
    case 'ArrowUp':
      activeIndex.value = (activeIndex.value - 1 + props.options.length) % props.options.length;
      break;
    case 'Home':
      activeIndex.value = 0;
      break;
    case 'End':
      activeIndex.value = props.options.length - 1;
      break;
    default:
      select(props.options[activeIndex.value]!.value);
  }
}
</script>

<template>
  <div
    ref="control"
    class="field label border suffix tw:m-0!"
    :class="{ 'tw:z-20': isOpen }"
    data-ui
  >
    <input
      :id="id"
      type="text"
      readonly
      class="tw:cursor-pointer!"
      :value="selectedOption ? $t(selectedOption.label) : ''"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-options`"
      :aria-activedescendant="isOpen ? `${id}-option-${activeIndex}` : undefined"
      @click="isOpen ? isOpen = false : openMenu()"
      @blur="isOpen = false"
      @keydown="onKeydown"
    >
    <label
      :for="id"
      class="active"
    >{{ $t(label) }}</label>
    <i aria-hidden="true"><ExpandMoreIcon /></i>
    <menu
      :id="`${id}-options`"
      :class="{ active: isOpen }"
      role="listbox"
      :aria-label="$t(label)"
      :aria-hidden="!isOpen"
    >
      <li
        v-for="(option, index) in options"
        :id="`${id}-option-${index}`"
        :key="option.value"
        class="ripple"
        :class="{ 'active': model === option.value, 'tw:bg-(--surface-container-highest)': activeIndex === index && model !== option.value }"
        role="option"
        :aria-selected="model === option.value"
        @mousedown.prevent
        @pointerenter="activeIndex = index"
        @click="select(option.value)"
      >
        <span class="max">{{ $t(option.label) }}</span>
        <i
          v-if="model === option.value"
          aria-hidden="true"
        ><CheckIcon /></i>
      </li>
    </menu>
  </div>
</template>
