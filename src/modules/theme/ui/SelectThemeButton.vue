<script setup lang="ts">
import type { Variants } from 'motion-v';
import DarkModeIcon from '@material-design-icons/svg/filled/dark_mode.svg?component';
import LightModeIcon from '@material-design-icons/svg/filled/light_mode.svg?component';
import { AnimatePresence, motion } from 'motion-v';
import { themeModel } from 'src/modules/theme';
import { SharedIcons } from 'src/shared';

const themeStore = themeModel.useThemeStore();

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
} satisfies Variants;

const buttons = [
  {
    icon: LightModeIcon,
    name: 'light',
  },
  {
    icon: DarkModeIcon,
    name: 'dark',
  },
  {
    icon: SharedIcons.ThemeLightDark,
    name: 'preferred',
  },
] satisfies { icon: any, name: themeModel.ColorScheme }[];
</script>

<template>
  <button
    class="transparent circle ripple"
    @click="themeStore.toggleColorScheme()"
  >
    <AnimatePresence
      mode="popLayout"
      :initial="false"
    >
      <template
        v-for="button in buttons"
        :key="button.name"
      >
        <motion.i
          v-if="themeStore.colorScheme.value === button.name"
          :key="button.name"
          :initial="variants.hidden"
          :animate="variants.visible"
          :exit="variants.hidden"
          :transition="{ duration: 0.2 }"
        >
          <component :is="button.icon" />
        </motion.i>
      </template>
    </AnimatePresence>
  </button>
</template>
