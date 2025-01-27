<script setup lang="ts">
import { TransitionSlide } from '@morev/vue-transitions';
import { useFocus, useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { routerModel } from 'src/modules/router';
import { computed, ref } from 'vue';
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
const searchInputEl = ref<HTMLInputElement | null>(null);
const isSearchInputFocused = useFocus(searchInputEl);
const isSearchLabelVisible = computed(() => !isSearchInputFocused.focused.value || y.value <= 80);
</script>

<template>
  <div class="tw-space-y-2">
    <div
      class="field suffix round border blur
      tw-sticky tw-top-[74px] tw-z-10 !tw-bg-transparent"
      :class="{ label: isSearchLabelVisible }"
    >
      <input
        :ref="(el) => searchInputEl = (el as HTMLInputElement)"
        v-model="searchModel"
        type="text"
      >
      <label v-if="isSearchLabelVisible">Поиск</label>
      <i>search</i>
    </div>

    <div v-if="!searchModel.length || (!articlesResults.length && isLoading)">
      <article>
        <template
          v-for="(article, index) of book.articles"
          :key="index"
        >
          <a
            class="row wave !tw-whitespace-break-spaces"
            @click="router.push({
              name: routerModel.RouteName.Article,
              params: { bookId, articleNumber: article.number },
            })"
            v-text="`${article.number}. ${article.title}`"
          />
          <hr v-if="index !== book.articles.length - 1">
        </template>
      </article>
    </div>

    <template v-else-if="articlesResults.length">
      <article>
        <template
          v-for="({ item: article }, index) of articlesResults"
          :key="index"
        >
          <a
            class="row wave"
            @click="router.push({
              name: routerModel.RouteName.Article,
              params: { bookId, articleNumber: article.number },
            })"
            v-text="`${article.number}. ${article.title}`"
          />
          <hr v-if="index !== articlesResults.length - 1">
        </template>
      </article>
    </template>

    <div v-else-if="!isLoading">
      Не найдено результатов для: "{{ searchModel }}"...
    </div>

    <TransitionSlide :offset="[0, 16]">
      <button
        v-if="y >= 300"
        class="border circle extra large-elevate secondary-border secondary-text blur
        tw-fixed tw-bottom-5 tw-right-5 !tw-bg-transparent tw-z-10"
        @click.prevent.stop="y = 0"
      >
        <i>keyboard_arrow_up</i>
      </button>
    </TransitionSlide>
  </div>
</template>
