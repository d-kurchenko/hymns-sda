<script setup lang="ts">
import TrashIcon from '@material-design-icons/svg/filled/close.svg?component';
import KeyboardArrowUpIcon from '@material-design-icons/svg/filled/keyboard_arrow_up.svg?component';
import SearchIcon from '@material-design-icons/svg/filled/search.svg?component';
import { useWindowVirtualizer } from '@tanstack/vue-virtual';
import { until, useFocus, useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { AnimatePresence, motion } from 'motion-v';
import { routerModel } from 'src/modules/router';
import { computed, ref, useTemplateRef } from 'vue';
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
const isSearchLabelHidden = computed(() =>
  y.value > 80 && (isSearchInputFocused.focused.value || searchModel.value.length),
);

const restoredScrollTop = (router.options.history.state.scroll as any)?.top as number | null;
if (restoredScrollTop && restoredScrollTop > window.scrollY) {
  until(isLoading)
    .toBe(false)
    .then(() => {
      scrollTo({ top: restoredScrollTop });
    });
}

const articlesWrapper = useTemplateRef('articlesWrapper');
const articlesVirtualizer = useWindowVirtualizer(
  computed(() => ({
    count: book.articles.length,
    estimateSize: () => 49,
    scrollMargin: articlesWrapper.value?.offsetTop ?? 0,
    enabled: !!(!isLoading.value && !searchModel.value.length),
  } satisfies Parameters<typeof useWindowVirtualizer>[0])),
);

const articlesResultsWrapper = useTemplateRef('articlesResultsWrapper');
const articlesResultsVirtualizer = useWindowVirtualizer(
  computed(() => ({
    count: articlesResults.value.length,
    estimateSize: () => 49,
    scrollMargin: articlesResultsWrapper.value?.offsetTop ?? 0,
    enabled: !!(!isLoading.value && searchModel.value.length && articlesResults.value.length),
  } satisfies Parameters<typeof useWindowVirtualizer>[0])),
);
</script>

<template>
  <div class="tw:flex-1 tw:flex tw:flex-col tw:gap-y-2">
    <div
      class="field suffix round border blur
      tw:sticky tw:top-[calc(74px+var(--safe-area-inset-top))] tw:z-1 tw:mb-0!"
      :class="{ label: !isSearchLabelHidden }"
    >
      <input
        :ref="(el) => searchInputEl = (el as HTMLInputElement)"
        v-model="searchModel"
        type="text"
      >
      <label v-if="!isSearchLabelHidden">{{ $t('articlesList.search.placeholder') }}</label>

      <AnimatePresence
        mode="popLayout"
        :initial="false"
      >
        <motion.i
          v-if="!searchModel.length"
          key="search"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.5 }"
          :transition="{ duration: 0.2 }"
        >
          <SearchIcon />
        </motion.i>
        <motion.i
          v-else
          key="trash"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.5 }"
          :transition="{ duration: 0.2 }"
          class="tw:pointer-events-auto!"
          @click.stop="searchModel = ''"
        >
          <TrashIcon />
        </motion.i>
      </AnimatePresence>
    </div>

    <div
      v-if="isLoading"
      class="tw:flex-1 tw:w-full tw:flex tw:justify-center tw:items-center tw:opacity-30"
    >
      <div class="shape loading-indicator extra" />
    </div>

    <article
      v-else-if="!searchModel.length"
      ref="articlesWrapper"
      style="overflow-anchor: none;"
    >
      <div
        class="tw:relative tw:w-full"
        :style="{ height: `${articlesVirtualizer.getTotalSize()}px` }"
      >
        <div
          class="tw:absolute tw:top-0 tw:left-0 tw:w-full"
          :style="{
            transform: `translateY(${
              articlesVirtualizer.getVirtualItems()[0]?.start - articlesVirtualizer.options.scrollMargin || 0
            }px)`,
          }"
        >
          <div
            v-for="virtualRow in articlesVirtualizer.getVirtualItems()"
            :key="(virtualRow.key as string)"
            :ref="(element) => articlesVirtualizer.measureElement((element as any))"
            :data-index="virtualRow.index"
          >
            <a
              class="row ripple tw:!whitespace-break-spaces"
              @click="router.push({
                name: routerModel.RouteName.Article,
                params: { bookId, articleNumber: book.articles[virtualRow.index].number },
              })"
              v-text="`${book.articles[virtualRow.index].number}. ${book.articles[virtualRow.index].title}`"
            />
            <hr v-if="virtualRow.index !== book.articles.length - 1">
          </div>
        </div>
      </div>
    </article>

    <article
      v-else-if="articlesResults.length"
      ref="articlesResultsWrapper"
      style="overflow-anchor: none;"
    >
      <div
        class="tw:relative tw:w-full"
        :style="{ height: `${articlesResultsVirtualizer.getTotalSize()}px` }"
      >
        <div
          class="tw:absolute tw:top-0 tw:left-0 tw:w-full"
          :style="{
            transform: `translateY(${
              articlesResultsVirtualizer.getVirtualItems()[0]?.start - articlesResultsVirtualizer.options.scrollMargin || 0
            }px)`,
          }"
        >
          <div
            v-for="virtualRow in articlesResultsVirtualizer.getVirtualItems()"
            :key="(virtualRow.key as string)"
            :ref="(element) => articlesResultsVirtualizer.measureElement((element as any))"
            :data-index="virtualRow.index"
          >
            <a
              class="row ripple tw:!whitespace-break-spaces"
              @click="router.push({
                name: routerModel.RouteName.Article,
                params: { bookId, articleNumber: articlesResults[virtualRow.index].item.number },
              })"
              v-text="`${articlesResults[virtualRow.index].item.number}. ${articlesResults[virtualRow.index].item.title}`"
            />
            <hr v-if="virtualRow.index !== articlesResults.length - 1">
          </div>
        </div>
      </div>
    </article>

    <div v-else-if="!isLoading">
      {{ $t('common.noResultsFound', [searchModel]) }}
    </div>

    <AnimatePresence :initial="false">
      <motion.button
        v-if="y >= 300"
        class="border circle extra large-elevate secondary-border secondary-text blur ripple tw:fixed tw:right-5 tw:z-10"
        :variants="{
          hidden: { opacity: 0, bottom: 0 },
          visible: { opacity: 1, bottom: 'calc(var(--tw-spacing) * 5)' },
        }"
        initial="hidden"
        animate="visible"
        exit="hidden"
        :transition="{ duration: 0.2 }"
        @click.prevent.stop="y = 0"
      >
        <i><KeyboardArrowUpIcon /></i>
      </motion.button>
    </AnimatePresence>
  </div>
</template>
