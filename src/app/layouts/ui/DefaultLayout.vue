<script setup lang="ts">
import { SelectThemeButton } from 'src/modules/theme';
import { Separator } from 'src/shared/ui/separator';

</script>

<template>
  <div class="h-full flex flex-col">
    <div class="py-2 px-4 flex justify-between items-center select-none">
      <div class="text-xl font-bold italic">Hymns SDA</div>
      <SelectThemeButton />
    </div>
  
    <Separator />
  
    <div class="px-6 py-2 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
