<script setup lang="ts">
import { useRoute } from 'vue-router';
import { bookLib, bookModel } from '..';
import { useAsyncState } from '@vueuse/core';

const route = useRoute()


const bookCode = route.params.bookId as bookModel.BookCode
const articleId = Number(route.params.articleId) as number

const book = bookLib.useBook(bookCode)

const { state: article } = useAsyncState(async () => {
  const article = await book.getArticle(articleId)
  return article;
}, '')

</script>

<template>
  <div class="flex flex-col items-center article-renderer">
    <div class="w-fit max-w-full" v-html="article" />
  </div>
</template>

<style lang="postcss">
.article-renderer {
  h1 {
    @apply text-xl font-bold;
  }

  p {
    @apply text-lg py-3;
  }
}
</style>
