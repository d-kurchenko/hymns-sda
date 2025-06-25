<script setup lang="ts">
import KeyboardArrowUpIcon from '@material-design-icons/svg/filled/keyboard_arrow_up.svg?component';
import SearchIcon from '@material-design-icons/svg/filled/search.svg?component';
import { TransitionSlide } from '@morev/vue-transitions';
import { until, useFocus, useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { routerModel } from 'src/modules/router';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { bookLib, bookModel } from '..';

const router = useRouter();
const { books } = bookModel;

const searchModel = useRouteQuery('search', '');

const { resultItems: articlesResults, isLoading } = bookLib.useSearchInBooks(searchModel);

const { y } = useWindowScroll({ behavior: 'smooth' });
const searchInputEl = ref<HTMLInputElement | null>(null);
const isSearchInputFocused = useFocus(searchInputEl);
const isSearchLabelVisible = computed(() => !isSearchInputFocused.focused.value || y.value <= 80);

const restoredScrollTop = (router.options.history.state.scroll as any)?.top as number | null;
if (restoredScrollTop && restoredScrollTop > window.scrollY) {
  until(isLoading)
    .toBe(false)
    .then(() => {
      scrollTo({ top: restoredScrollTop });
    });
}
</script>

<template>
  <div class="tw-space-y-2">
    <div
      class="field suffix round border blur
      tw-sticky tw-top-[calc(74px_+_var(--safe-area-inset-top))] tw-z-10"
      :class="{ label: isSearchLabelVisible }"
    >
      <input
        :ref="(el) => searchInputEl = (el as HTMLInputElement)"
        v-model="searchModel"
        type="text"
      >
      <label v-if="isSearchLabelVisible">Глобальный поиск</label>
      <i><SearchIcon /></i>
    </div>

    <template v-if="!searchModel.length || (!articlesResults.length && isLoading)">
      <article>
        <template
          v-for="(book, index) in books"
          :key="index"
        >
          <a
            class="row ripple !tw-whitespace-break-spaces"
            @click="router.push({
              name: routerModel.RouteName.Book,
              params: { bookId: book.id },
            })"
            v-text="book.title"
          />
          <hr v-if="index !== books.length - 1">
        </template>
      </article>
    </template>

    <template v-else-if="articlesResults.length">
      <article>
        <template
          v-for="({ item: article }, index) of articlesResults"
          :key="index"
        >
          <a
            class="row ripple !tw-whitespace-break-spaces"
            @click="router.push({
              name: routerModel.RouteName.Article,
              params: { bookId: article.bookId, articleNumber: article.number },
            })"
          >
            <div class="tw-w-full tw-space-y-2 tw-py-2">
              <span>{{ article.number }}. {{ article.title }}</span>
              <div>
                <span class="tw-text-xs tw-text-[var(--on-secondary)] tw-bg-[var(--secondary)] tw-rounded-3xl tw-px-1 tw-py-1">
                  {{ article.bookTitle }}
                </span>
              </div>
            </div>
          </a>
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
        tw-fixed tw-bottom-5 tw-right-5 tw-z-10 ripple"
        @click.prevent.stop="y = 0"
      >
        <i><KeyboardArrowUpIcon /></i>
      </button>
    </TransitionSlide>
  </div>
</template>
