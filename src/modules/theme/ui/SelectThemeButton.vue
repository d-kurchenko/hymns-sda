<script setup lang="ts">
import { Moon, Sun, SunMoon } from 'lucide-vue-next';
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
    <Transition mode="out-in">
      <Sun v-if="themeStore.colorScheme === 'light'" />
      <Moon v-else-if="themeStore.colorScheme === 'dark'" />
      <SunMoon v-else-if="themeStore.colorScheme === 'preferred'" />
    </Transition>
  </Button>
</template>
