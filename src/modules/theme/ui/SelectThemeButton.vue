<script setup lang="ts">
import type { Variants } from 'motion-v';
import type { Component } from 'vue';
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

const icons: Record<themeModel.ColorScheme, Component> = {
  [themeModel.COLOR_SCHEME.LIGHT]: LightModeIcon,
  [themeModel.COLOR_SCHEME.DARK]: DarkModeIcon,
  [themeModel.COLOR_SCHEME.SYSTEM]: SharedIcons.ThemeLightDark,
};
</script>

<template>
  <button
    type="button"
    class="transparent circle ripple"
    :aria-label="$t('settings.theme')"
    @click="themeStore.toggleColorScheme()"
  >
    <AnimatePresence
      mode="popLayout"
      :initial="false"
    >
      <template
        v-for="option in themeModel.COLOR_SCHEME_OPTIONS"
        :key="option.value"
      >
        <motion.i
          v-if="themeStore.colorScheme.value === option.value"
          :key="option.value"
          :initial="variants.hidden"
          :animate="variants.visible"
          :exit="variants.hidden"
          :transition="{ duration: 0.2 }"
        >
          <component :is="icons[option.value]" />
        </motion.i>
      </template>
    </AnimatePresence>
  </button>
</template>
