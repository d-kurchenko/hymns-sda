<script setup lang="ts">
import TrashIcon from '@material-design-icons/svg/filled/close.svg?component';
import SearchIcon from '@material-design-icons/svg/filled/search.svg?component';
import { useFocus } from '@vueuse/core';
import { AnimatePresence, motion } from 'motion-v';
import { routerModel } from 'src/modules/router';
import { useSettings } from 'src/modules/settings/model';
import { usePageScroll } from 'src/shared/page-scroll';
import { computed, ref, watch } from 'vue';
import { bookLib, bookModel } from '..';
import { usePageSearch } from '../lib/page-search.use';
import VirtualArticlesList from './VirtualArticlesList.vue';

const { books } = bookModel;
const languages = useSettings().setting('bookLanguages');
const displayedBooks = computed(() => books.filter(book => languages.value.includes(book.language)));

const searchModel = usePageSearch();

const { resultItems: articlesResults, isLoading } = bookLib.useSearchInBooks(searchModel, { languages });
const displayedArticles = computed(() => articlesResults.value.map(result => result.item));

const { y, scrollToTop } = usePageScroll();
watch(languages, () => scrollToTop());
const searchInputEl = ref<HTMLInputElement | null>(null);
const isSearchInputFocused = useFocus(searchInputEl);
const isSearchLabelHidden = computed(() =>
  y.value > 80 && (isSearchInputFocused.focused.value || searchModel.value.length),
);
</script>

<template>
  <div
    class="tw:flex-1 tw:flex tw:flex-col tw:gap-y-2"
    :aria-busy="isLoading"
  >
    <div
      class="field suffix round border blur
      tw:sticky tw:top-0 tw:z-10 tw:mb-0!"
      :class="{ label: !isSearchLabelHidden }"
    >
      <input
        :ref="(el) => searchInputEl = (el as HTMLInputElement)"
        v-model="searchModel"
        type="text"
      >
      <label v-if="!isSearchLabelHidden">{{ $t('booksList.searchArticles.placeholder') }}</label>
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
      v-if="isLoading && !displayedArticles.length"
      class="tw:flex-1 tw:w-full tw:flex tw:justify-center tw:items-center tw:opacity-30"
    >
      <div class="shape loading-indicator extra" />
    </div>

    <template v-else-if="!searchModel.length">
      <article>
        <template
          v-for="(book, index) in displayedBooks"
          :key="book.id"
        >
          <RouterLink
            class="row ripple tw:!whitespace-break-spaces"
            :to="{
              name: routerModel.RouteName.Book,
              params: { bookId: book.id },
            }"
          >
            {{ book.title }}
          </RouterLink>
          <hr v-if="index !== displayedBooks.length - 1">
        </template>
      </article>
    </template>

    <VirtualArticlesList
      v-else-if="displayedArticles.length"
      :articles="displayedArticles"
      show-book
    />

    <div v-else-if="!isLoading">
      {{ $t('common.noResultsFound', [searchModel]) }}
    </div>
  </div>
</template>
