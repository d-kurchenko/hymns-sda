<script setup lang="ts">
import { Button } from 'src/shared/ui/button';
import { useRouter } from 'vue-router';
import { routerModel } from 'src/modules/router';
import { useRoute } from 'vue-router';
import { bookModel, bookLib } from '..';

const router = useRouter()
const route = useRoute()

const bookCode = route.params.bookId as bookModel.BookCode
const {book} = bookLib.useBook(bookCode)

</script>

<template>
  <Button v-for="(article, index) of book.articles" :key="index" variant="ghost" class="w-full text-left justify-start"
    @click="router.push({
      name: routerModel.RouteName.Article,
      params: { bookId: book.code, articleId: index + 1 }
    })">
    {{ article }}
  </Button>
</template>
