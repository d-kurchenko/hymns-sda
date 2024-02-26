<script setup lang="ts">
import { Button } from 'src/shared/ui/button';
import { useRouter } from 'vue-router';
import { routerModel } from 'src/modules/router';
import { bookModel } from '..';

const router = useRouter();
const books = bookModel.books;
</script>

<template>
  <nav>
    <Button
      v-for="book in books"
      :key="book.code"
      variant="ghost"
      class="w-full text-left justify-start"
      @click="router.push({
        name: routerModel.RouteName.Book,
        params: { bookId: book.code },
      })"
    >
      {{ book.name }}
    </Button>
  </nav>
</template>
