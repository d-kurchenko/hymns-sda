<script setup lang="ts">
import { useId } from 'vue';

defineProps<{ title: string }>();
const headingId = useId();
</script>

<template>
  <section
    class="tw:flex tw:flex-col tw:gap-5 tw:*:m-0!"
    :aria-labelledby="headingId"
  >
    <h2
      :id="headingId"
      class="tw:text-lg tw:font-bold"
    >
      {{ $t(title) }}
    </h2>
    <slot />
  </section>
</template>
