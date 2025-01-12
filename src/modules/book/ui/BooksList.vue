<script setup lang="ts">
import { TransitionSlide } from '@morev/vue-transitions';
import { until, useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ChevronUp, Search } from 'lucide-vue-next';
import { routerModel } from 'src/modules/router';
import { Button } from 'src/shared/ui/button';
import Input from 'src/shared/ui/input/Input.vue';
import { useRouter } from 'vue-router';
import { bookLib, bookModel } from '..';

const router = useRouter();
const { books } = bookModel;

const searchModel = useRouteQuery('search', '');

const { resultItems: articlesResults, isLoading } = bookLib.useSearchInBooks(searchModel);

const { y } = useWindowScroll({ behavior: 'smooth' });

const restoredScrollTop = (history.state.scroll as any).top as number;
if (restoredScrollTop > window.scrollY) {
  until(isLoading)
    .toBe(false)
    .then(() => {
      scrollTo({ top: restoredScrollTop });
    });
}
</script>

<template>
  <div class="space-y-2">
    <div class="w-full sticky z-20 top-[65px]">
      <Input
        id="search"
        v-model="searchModel"
        type="text"
        placeholder="Глобальный поиск"
        class="pl-10"
      />

      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <template v-if="!searchModel.length || (!articlesResults.length && isLoading)">
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
    </template>

    <template v-else-if="articlesResults.length">
      <Button
        v-for="({ item: article }, index) of articlesResults"
        :key="index"
        class="w-full text-left justify-start whitespace-normal h-auto"
        variant="ghost"
        @click="router.push({
          name: routerModel.RouteName.Article,
          params: { bookId: article.bookId, articleNumber: article.number },
        })"
      >
        <div class="w-full space-y-2">
          <div>
            {{ article.number }}. {{ article.title }}
          </div>
          <div class="text-xs text-foreground/60">
            <span class="bg-foreground/10 rounded-3xl px-1">{{ article.bookTitle }}</span>
          </div>
        </div>
      </Button>
    </template>

    <template v-else-if="!isLoading">
      Не найдено результатов для: "{{ searchModel }}"...
    </template>

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
