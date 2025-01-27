<script setup lang="ts">
import { TransitionFade } from '@morev/vue-transitions';
import { Moon, Sun, SunMoon } from 'lucide-vue-next';
import { themeModel } from 'src/modules/theme';

const themeStore = themeModel.useThemeStore();
</script>

<template>
  <button
    class="transparent circle"
    @click="themeStore.toggleColorScheme()"
  >
    <TransitionFade
      mode="out-in"
      :duration="100"
    >
      <i v-if="themeStore.colorScheme.value === 'light'">light_mode</i>
      <i v-else-if="themeStore.colorScheme.value === 'dark'">dark_mode</i>
      <i v-else-if="themeStore.colorScheme.value === 'preferred'">auto_awesome</i>
    </TransitionFade>
  </Button>
</template>
