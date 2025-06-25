<script setup lang="ts">
import { useRoute } from 'vue-router';
import { bookLib } from '..';
import { useArticleAppearance } from '../lib';

const route = useRoute();

const { fontSize } = useArticleAppearance();

const bookId = Number(route.params.bookId);
const articleNumber = Number(route.params.articleNumber);

const { book } = bookLib.useBook(bookId);

const article = book.articles.find(article => article.number === articleNumber);
</script>

<template>
  <div
    v-if="article"
    :style="{
      fontSize: `${fontSize}px`,
    }"
    class="article-renderer tw-flex tw-flex-col tw-items-center tw-grow"
  >
    <div
      class="tw-w-fit tw-max-w-full tw-grow"
      v-html="article.content"
    />
  </div>
</template>

<style lang="postcss">
.article-renderer {
  h1 {
    font-size: 2.25em !important;
    line-height: 1.5em !important;
    font-weight: 700 !important;
  }

  h3 {
    font-size: 1.25em;
    line-height: 1.2em;
    font-weight: 700;
  }

  p {
    font-size: 1.875em;
    line-height: 1.25em;
  }

  i {
    all: unset;
    font-style: italic;
  }

  pre {
    white-space: pre;
    font-size: 1.25em;
    line-height: 1.5em;
    overflow: auto;
  }
}
</style>
