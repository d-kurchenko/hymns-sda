<script setup lang="ts">
import { BooksList } from 'src/modules/book/ui';
import ScrollPage from 'src/shared/ui/ScrollPage.vue';
</script>

<template>
  <ScrollPage show-scroll-to-top>
    <BooksList />
  </ScrollPage>
</template>
