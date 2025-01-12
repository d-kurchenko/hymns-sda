<script setup lang="ts">
import { SelectThemeButton } from 'src/modules/theme';
</script>

<template>
  <div class="h-full flex flex-1 flex-col">
    <div class="py-2 px-4 flex justify-between items-center select-none sticky top-0 bg-background/70 backdrop-blur-lg border-b z-10">
      <div class="text-2xl font-bold italic">
        Hymns SDA
      </div>
      <SelectThemeButton />
    </div>

    <div class="flex flex-col flex-1 px-6 py-2">
      <RouterView v-slot="{ Component }">
        <Component :is="Component" />
      </RouterView>
    </div>
  </div>
</template>
