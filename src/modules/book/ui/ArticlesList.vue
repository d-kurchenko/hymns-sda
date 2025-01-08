<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse';
import { useRouteQuery } from '@vueuse/router';
import { Search } from 'lucide-vue-next';
import { routerModel } from 'src/modules/router';
import { Button } from 'src/shared/ui/button';
import { Input } from 'src/shared/ui/input';
import { useRoute, useRouter } from 'vue-router';
import { bookLib } from '..';

const router = useRouter();
const route = useRoute();

const bookId = Number(route.params.bookId);
const { book } = bookLib.useBook(bookId);

const searchModel = useRouteQuery('search', '');

const { results: articlesResults } = useFuse(searchModel, book.articles, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    isCaseSensitive: false,
    keys: [
      {
        name: 'title',
        weight: 1,
      },
      {
        name: 'content',
        getFn(article) {
          const div = document.createElement('div');
          div.innerHTML = article.content;

          const plainText = (div.textContent || '')
            .replace(/[\n,\-.?!@#$:;%^&[\]"'/_\\]/g, '  ')
            .replace(/\s+/g, ' ');

          return plainText;
        },
      },
    ],

    threshold: 0.3,
    distance: 10000,
  },
});
</script>

<template>
  <div class="space-y-2">
    <div class="w-full relative">
      <Input
        id="search"
        v-model="searchModel"
        type="text"
        placeholder="Поиск..."
        class="pl-10"
      />

      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <div v-if="articlesResults.length">
      <Button
        v-for="({ item: article }, index) of articlesResults"
        :key="index"
        class="w-full text-left justify-start whitespace-normal"
        variant="ghost"
        @click="router.push({
          name: routerModel.RouteName.Article,
          params: { bookId, articleNumber: article.number },
        })"
      >
        {{ article.number }}. {{ article.title }}
      </Button>
    </div>

    <div v-else>
      Не найдено результатов для: "{{ searchModel }}"...
    </div>
  </div>
</template>
