<script setup lang="ts">
import { shallowRef, type FunctionalComponent, type HTMLAttributes } from 'vue'
import { cn } from 'src/shared/utils'
import { useVModel } from '@vueuse/core'
import { CircleXIcon } from 'lucide-vue-next';

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  prefixIcon?: FunctionalComponent
  clearable?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const ref = shallowRef<null | HTMLInputElement>(null)

function clear() {
  modelValue.value = ''
  ref.value?.focus()
}
</script>

<template>
  <div :class="cn('relative', props.class)">
    <input v-bind="$attrs" v-model="modelValue"
      ref="ref"
      :class="[
        cn('flex h-10 w-full relative rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'),
        {
          'pl-10': prefixIcon,
          'pr-10': clearable
        }
        ]"
    >
    <span v-if="prefixIcon" class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Component :is="prefixIcon" class="size-6 text-muted-foreground"/>
    </span>

    <span v-if="clearable && modelValue" class="absolute flex items-center justify-center mr-2 right-0 top-1/2 -translate-y-1/2 w-7 h-full cursor-pointer text-muted-foreground hover:text-foreground">
      <CircleXIcon @click="clear" class="size-4"/>
    </span>
  </div>
</template>
