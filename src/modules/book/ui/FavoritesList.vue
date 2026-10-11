<script setup lang="ts">
import type { Article, Book } from '../model';
import StarOutlineIcon from '@material-design-icons/svg/outlined/star_border.svg?component';
import { useTimeoutFn } from '@vueuse/core';
import { usePageScroll } from 'src/shared/page-scroll';
import { usePageVirtualizer } from 'src/shared/page-virtualizer';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useFavorites } from '../lib';
import { books, FAVORITE_VIEW } from '../model';
import ArticleListItem from './ArticleListItem.vue';
import FavoritesControls from './FavoritesControls.vue';

type FavoriteRow = { type: 'book', book: Book } | { type: 'article', article: Article };

const { favorites, view, sort } = useFavorites();
const { scrollToTop } = usePageScroll();
const rows = computed<FavoriteRow[]>(() => {
  if (view.value === FAVORITE_VIEW.LIST)
    return favorites.value.map(article => ({ type: 'article', article }));

  return books.flatMap<FavoriteRow>((book) => {
    const articles = favorites.value.filter(article => article.bookId === book.id);
    return articles.length
      ? [{ type: 'book', book }, ...articles.map<FavoriteRow>(article => ({ type: 'article', article }))]
      : [];
  });
});

const animateChanges = ref(false);
const { start: finishAnimation } = useTimeoutFn(() => animateChanges.value = false, 280, { immediate: false });
watch(() => favorites.value.length, () => {
  animateChanges.value = true;
  finishAnimation();
}, { flush: 'sync' });

watch([view, sort], () => scrollToTop());

const list = useTemplateRef('list');
const articleHeight = computed(() => view.value === FAVORITE_VIEW.LIST ? 88 : 64);
const rowHeight = (index: number) => rows.value[index].type === 'book' ? 80 : articleHeight.value;

const virtualizer = usePageVirtualizer(list, computed(() => ({
  count: rows.value.length,
  estimateSize: rowHeight,
  getItemKey: index => rows.value[index].type === 'book'
    ? `book:${rows.value[index].book.id}`
    : `${rows.value[index].article.bookId}:${rows.value[index].article.number}`,
})));
const virtualRows = computed(() => virtualizer.value.getVirtualItems().map(item => ({
  ...item,
  row: rows.value[item.index],
})));
</script>

<template>
  <div class="tw:flex-1 tw:flex tw:flex-col tw:gap-5">
    <div class="tw:flex tw:items-center tw:gap-3">
      <h1 class="tw:text-2xl tw:font-bold">
        {{ $t('navigation.favorites') }}
      </h1>
      <span class="tw:rounded-lg tw:bg-(--surface-container) tw:text-(--on-surface-variant) tw:text-xs tw:tabular-nums tw:px-2 tw:py-1">{{ favorites.length }}</span>
    </div>

    <div class="tw:sticky tw:top-0 tw:z-12">
      <FavoritesControls />
    </div>

    <Transition
      mode="out-in"
      enter-active-class="tw:transition-opacity tw:duration-150 tw:motion-reduce:transition-none"
      leave-active-class="tw:transition-opacity tw:duration-150 tw:motion-reduce:transition-none"
      enter-from-class="tw:opacity-0"
      leave-to-class="tw:opacity-0"
    >
      <article
        v-if="rows.length || animateChanges"
        :key="`${view}:${sort}`"
        ref="list"
        class="tw:m-0! tw:[overflow-anchor:none]"
      >
        <div
          class="tw:relative tw:w-full"
          :style="{ height: `${virtualizer.getTotalSize()}px` }"
        >
          <TransitionGroup
            tag="div"
            :css="animateChanges && !virtualizer.isScrolling"
            enter-active-class="tw:transition-opacity tw:duration-200 tw:motion-reduce:transition-none"
            leave-active-class="tw:transition-opacity tw:duration-200 tw:pointer-events-none tw:motion-reduce:transition-none"
            enter-from-class="tw:opacity-0"
            leave-to-class="tw:opacity-0"
            move-class="tw:transition-transform tw:duration-200 tw:motion-reduce:transition-none"
          >
            <div
              v-for="virtualRow in virtualRows"
              :key="String(virtualRow.key)"
              class="tw:absolute tw:top-0 tw:left-0 tw:w-full"
              :style="{
                height: `${virtualRow.size}px`,
                top: `${virtualRow.start - virtualizer.options.scrollMargin}px`,
              }"
            >
              <h2
                v-if="virtualRow.row.type === 'book'"
                class="tw:h-full tw:flex tw:items-center tw:text-xl tw:font-semibold tw:text-(--primary)"
              >
                <span
                  class="tw:line-clamp-2"
                  :title="virtualRow.row.book.title"
                >{{ virtualRow.row.book.title }}</span>
              </h2>
              <template v-else>
                <ArticleListItem
                  :article="virtualRow.row.article"
                  :show-book="view === FAVORITE_VIEW.LIST"
                  truncate
                  :style="{ height: `${articleHeight - 1}px` }"
                />
                <hr
                  v-if="virtualRow.index !== rows.length - 1"
                  class="tw:m-0!"
                >
              </template>
            </div>
          </TransitionGroup>
        </div>
      </article>
    </Transition>

    <Transition
      enter-active-class="tw:transition-opacity tw:duration-200 tw:motion-reduce:transition-none"
      leave-active-class="tw:transition-opacity tw:duration-200 tw:motion-reduce:transition-none"
      enter-from-class="tw:opacity-0"
      leave-to-class="tw:opacity-0"
    >
      <div
        v-if="!rows.length && !animateChanges"
        class="tw:flex-1 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:py-12 tw:text-center tw:text-(--on-surface-variant)"
      >
        <i class="extra"><StarOutlineIcon /></i>
        <p class="tw:font-bold">
          {{ $t('favorites.empty.title') }}
        </p>
        <p>{{ $t('favorites.empty.description') }}</p>
      </div>
    </Transition>
  </div>
</template>
