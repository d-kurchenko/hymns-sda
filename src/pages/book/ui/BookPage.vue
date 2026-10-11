<script setup lang="ts">
import { ArticlesList } from 'src/modules/book';
import ScrollPage from 'src/shared/ui/ScrollPage.vue';
</script>

<template>
  <ScrollPage show-scroll-to-top>
    <ArticlesList />
  </ScrollPage>
</template>
