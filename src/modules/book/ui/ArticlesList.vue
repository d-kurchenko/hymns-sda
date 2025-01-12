<script setup lang="ts">
import { TransitionSlide } from '@morev/vue-transitions';
import { useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ChevronUp, SearchIcon } from 'lucide-vue-next';
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

const { resultItems: articlesResults, isLoading } = bookLib.useSearchInBooks(
  searchModel,
  bookId,
);

const { y } = useWindowScroll({ behavior: 'smooth' });
</script>

<template>
  <div class="space-y-2">
    <Input
      id="search"
      v-model="searchModel"
      type="text"
      placeholder="Поиск"
      :prefix-icon="SearchIcon"
      clearable
      class="w-full sticky top-[65px]"
    />

    <div v-if="!searchModel.length || (!articlesResults.length && isLoading)">
      <Button
        v-for="(article, index) of book.articles"
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

    <template v-else-if="articlesResults.length">
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
    </template>

    <div v-else-if="!isLoading">
      Не найдено результатов для: "{{ searchModel }}"...
    </div>

    <TransitionSlide :offset="[0, 16]">
      <Button
        v-if="y >= 300"
        variant="outline"
        size="icon"
        class="fixed bottom-5 right-5 z-10 pointer-events-auto"
        @click.prevent.stop="y = 0"
      >
        <ChevronUp class="w-4 h-4" />
      </Button>
    </TransitionSlide>
  </div>
</template>
