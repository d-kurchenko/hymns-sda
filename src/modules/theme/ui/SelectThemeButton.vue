<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import { themeModel } from 'src/modules/theme';
import { Button } from 'src/shared/ui/button';

const themeStore = themeModel.useThemeStore();
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="themeStore.toggleColorScheme()"
  >
    <Sun v-if="themeStore.colorScheme === 'dark'" />
    <Moon v-else-if="themeStore.colorScheme === 'light'" />
  </Button>
</template>
