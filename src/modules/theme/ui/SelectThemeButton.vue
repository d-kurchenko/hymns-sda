<script setup lang="ts">
import { TransitionFade } from '@morev/vue-transitions';
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
    <TransitionFade
      mode="out-in"
      :duration="100"
    >
      <Sun v-if="themeStore.colorScheme === 'light'" />
      <Moon v-else-if="themeStore.colorScheme === 'dark'" />
      <SunMoon v-else-if="themeStore.colorScheme === 'preferred'" />
    </TransitionFade>
  </Button>
</template>
