<script setup lang="ts">
import { useRoute } from 'vue-router';
import { bookLib } from '..';

const route = useRoute();

const bookId = Number(route.params.bookId);
const articleNumber = Number(route.params.articleNumber);

const { book } = bookLib.useBook(bookId);

const article = book.articles.find(article => article.number === articleNumber);
</script>

<template>
  <div
    v-if="article"
    class="flex flex-col items-center article-renderer"
  >
    <div
      class="w-fit max-w-full overflow-auto"
      v-html="article.content"
    />
  </div>
</template>

<style lang="postcss">
.article-renderer {
  h1 {
    @apply text-3xl font-bold;
  }

  p {
    @apply text-3xl py-3;
  }
}
</style>
