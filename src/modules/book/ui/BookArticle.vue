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
    class="article-renderer tw-flex tw-flex-col tw-items-center tw-grow"
  >
    <div
      class="tw-w-fit tw-max-w-full tw-overflow-auto tw-grow"
      v-html="article.content"
    />
  </div>
</template>

<style lang="postcss">
.article-renderer {
  h1 {
    @apply !tw-text-4xl !tw-font-bold;
  }

  h3 {
    @apply tw-text-xl tw-font-bold;
  }

  p {
    @apply tw-text-3xl;
  }

  i {
    all: unset;
    @apply tw-italic;
  }

  pre {
    @apply tw-whitespace-pre tw-w-fit tw-text-xl;
  }
}
</style>
