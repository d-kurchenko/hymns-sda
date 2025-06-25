<script setup lang="ts">
import DarkModeIcon from '@material-design-icons/svg/filled/dark_mode.svg?component';
import LightModeIcon from '@material-design-icons/svg/filled/light_mode.svg?component';
import { TransitionFade } from '@morev/vue-transitions';
import { themeModel } from 'src/modules/theme';
import { SharedIcons } from 'src/shared';

const themeStore = themeModel.useThemeStore();
</script>

<template>
  <button
    class="transparent circle ripple"
    @click="themeStore.toggleColorScheme()"
  >
    <TransitionFade
      mode="out-in"
      :duration="100"
    >
      <i v-if="themeStore.colorScheme.value === 'light'"><LightModeIcon /></i>
      <i v-else-if="themeStore.colorScheme.value === 'dark'"><DarkModeIcon /></i>
      <i v-else-if="themeStore.colorScheme.value === 'preferred'"><SharedIcons.ThemeLightDark /></i>
    </TransitionFade>
  </Button>
</template>
