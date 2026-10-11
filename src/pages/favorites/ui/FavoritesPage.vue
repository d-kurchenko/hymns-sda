<script setup lang="ts">
import { FavoritesList } from 'src/modules/book';
import ScrollPage from 'src/shared/ui/ScrollPage.vue';
</script>

<template>
  <ScrollPage show-scroll-to-top>
    <FavoritesList />
  </ScrollPage>
</template>
