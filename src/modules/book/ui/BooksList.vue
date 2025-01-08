<script setup lang="ts">
import { routerModel } from 'src/modules/router';
import { Button } from 'src/shared/ui/button';
import { useRouter } from 'vue-router';
import { bookModel } from '..';

const router = useRouter();
const books = bookModel.books;
</script>

<template>
  <nav>
    <Button
      v-for="book in books"
      :key="book.id"
      variant="ghost"
      class="w-full text-left justify-start whitespace-normal"
      @click="router.push({
        name: routerModel.RouteName.Book,
        params: { bookId: book.id },
      })"
    >
      {{ book.title }}
    </Button>
  </nav>
</template>
