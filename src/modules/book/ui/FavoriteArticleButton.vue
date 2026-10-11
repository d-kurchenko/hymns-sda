<script setup lang="ts">
import type { Article } from '../model';
import StarIcon from '@material-design-icons/svg/filled/star.svg?component';
import StarOutlineIcon from '@material-design-icons/svg/outlined/star_border.svg?component';
import { AnimatePresence, motion } from 'motion-v';
import { computed } from 'vue';
import { useFavorites } from '../lib';

const props = defineProps<{ article: Article }>();
const { isFavorite, toggleFavorite } = useFavorites();
const active = computed(() => isFavorite(props.article));
</script>

<template>
  <button
    type="button"
    class="transparent circle ripple"
    :aria-pressed="active"
    :aria-label="$t(active ? 'favorites.remove' : 'favorites.add')"
    :title="$t(active ? 'favorites.remove' : 'favorites.add')"
    @click.stop="toggleFavorite(article)"
  >
    <AnimatePresence
      mode="popLayout"
      :initial="false"
    >
      <motion.i
        :key="String(active)"
        :initial="{ opacity: 0, scale: 0.5 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.5 }"
        :transition="{ duration: 0.2 }"
      >
        <component :is="active ? StarIcon : StarOutlineIcon" />
      </motion.i>
    </AnimatePresence>
  </button>
</template>
