<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { Component } from 'vue';
import { DefaultLayout } from 'src/app/layouts';
import type { LayoutName } from 'src/app/layouts';
import { useRoute } from 'vue-router';
import { themeModel } from 'src/modules/theme';
import { storeToRefs } from 'pinia';

const layoutsMap: Record<LayoutName, () => Component> = {
  default: () => DefaultLayout,
  empty: () => defineAsyncComponent(() => import('src/app/layouts/ui/EmptyLayout.vue')),
};

const route = useRoute();
const layout = computed(() => layoutsMap[route.meta.layout || 'default']());

const { colorScheme } = storeToRefs(themeModel.useThemeStore());
</script>

<template>
  <div
    class="h-lvh w-full bg-background text-foreground"
    :class="colorScheme"
  >
    <component :is="layout">
      <RouterView />
    </component>
  </div>
</template>
