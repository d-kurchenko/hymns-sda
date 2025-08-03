<script setup lang="ts">
import KeyboardArrowUpIcon from '@material-design-icons/svg/filled/keyboard_arrow_up.svg?component';
import SearchIcon from '@material-design-icons/svg/filled/search.svg?component';
import { TransitionSlide } from '@morev/vue-transitions';
import { useWindowVirtualizer } from '@tanstack/vue-virtual';
import { until, useFocus, useWindowScroll } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { routerModel } from 'src/modules/router';
import { computed, ref, useTemplateRef } from 'vue';
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

const virtualizerWrapper = useTemplateRef('virtualizerWrapper');
const rowVirtualizer = useWindowVirtualizer(
  computed(() => ({
    count: articlesResults.value.length,
    estimateSize: () => 67,
    scrollMargin: virtualizerWrapper.value?.offsetTop ?? 0,
    enabled: !!(!isLoading.value && searchModel.value.length && articlesResults.value.length),
  } satisfies Parameters<typeof useWindowVirtualizer>[0])),
);
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());
</script>

<template>
  <div class="tw:flex-1 tw:flex tw:flex-col tw:gap-y-2">
    <div
      class="field suffix round border blur
      tw:sticky tw:top-[calc(74px_+_var(--safe-area-inset-top))] tw:z-10 tw:!mb-0"
      :class="{ label: isSearchLabelVisible }"
    >
      <input
        :ref="(el) => searchInputEl = (el as HTMLInputElement)"
        v-model="searchModel"
        type="text"
      >
      <label v-if="isSearchLabelVisible">{{ $t('booksList.searchArticles.placeholder') }}</label>
      <i><SearchIcon /></i>
    </div>

    <div
      v-if="isLoading"
      class="tw:flex-1 tw:w-full tw:flex tw:justify-center tw:items-center tw:opacity-30"
    >
      <div class="shape loading-indicator extra" />
    </div>

    <template v-else-if="!searchModel.length">
      <article>
        <template
          v-for="(book, index) in books"
          :key="index"
        >
          <a
            class="row ripple tw:!whitespace-break-spaces"
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
      <article ref="virtualizerWrapper">
        <div
          class="tw:relative tw:w-full"
          :style="{ height: `${rowVirtualizer.getTotalSize()}px` }"
          style="overflow-anchor: none;"
        >
          <div
            class="tw:absolute tw:top-0 tw:left-0 tw:w-full"
            :style="{
              transform: `translateY(${
                virtualRows[0]?.start - rowVirtualizer.options.scrollMargin || 0
              }px)`,
            }"
          >
            <div
              v-for="virtualRow in virtualRows"
              :key="(virtualRow.key as string)"
              :ref="(element) => rowVirtualizer.measureElement((element as any))"
              :data-index="virtualRow.index"
            >
              <a
                class="row ripple tw:!whitespace-break-spaces tw:h-full"
                @click="router.push({
                  name: routerModel.RouteName.Article,
                  params: { bookId: articlesResults[virtualRow.index].item.bookId, articleNumber: articlesResults[virtualRow.index].item.number },
                })"
              >
                <div class="tw:w-full tw:flex tw:flex-col tw:items-start tw:gap-y-2 tw:py-2">
                  <span>{{ articlesResults[virtualRow.index].item.number }}. {{ articlesResults[virtualRow.index].item.title }}</span>
                  <div class="tw:text-xs tw:text-(--on-secondary) tw:bg-(--secondary) tw:rounded-3xl tw:px-1 tw:pt-0.5 tw:max-w-full tw:truncate">
                    {{ articlesResults[virtualRow.index].item.bookTitle }}
                  </div>
                </div>
              </a>
              <hr v-if="virtualRow.index !== articlesResults.length - 1">
            </div>
          </div>
        </div>
      </article>
    </template>

    <div v-else-if="!isLoading">
      {{ $t('common.noResultsFound', [searchModel]) }}
    </div>

    <TransitionSlide :offset="[0, 16]">
      <button
        v-if="(rowVirtualizer.scrollOffset ?? 0) >= 300"
        class="border circle extra large-elevate secondary-border secondary-text blur
        tw:fixed tw:bottom-5 tw:right-5 tw:z-10 ripple"
        @click.prevent.stop="y = 0"
      >
        <i><KeyboardArrowUpIcon /></i>
      </button>
    </TransitionSlide>
  </div>
</template>
