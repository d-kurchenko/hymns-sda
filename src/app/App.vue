<script setup lang="ts">
import type { LayoutName } from 'src/app/layouts';
import type { Component } from 'vue';
import { DefaultLayout } from 'src/app/layouts';
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const layoutsMap: Record<LayoutName, () => Component> = {
  default: () => DefaultLayout,
  empty: () => defineAsyncComponent(() => import('src/app/layouts/ui/EmptyLayout.vue')),
};

const route = useRoute();
const layout = computed(() => layoutsMap[route.meta.layout || 'default']());
</script>

<template>
  <div class="min-h-lvh flex flex-col">
    <component :is="layout">
      <RouterView />
    </component>
  </div>
</template>
