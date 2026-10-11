<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import type { Article } from '../model';
import { usePageVirtualizer } from 'src/shared/page-virtualizer';
import { computed, useTemplateRef } from 'vue';
import ArticleListItem from './ArticleListItem.vue';

const props = defineProps<{ articles: Article[], showBook?: boolean }>();
const list = useTemplateRef('list');
const virtualizer = usePageVirtualizer(list, computed(() => ({
  count: props.articles.length,
  estimateSize: () => props.showBook ? 100 : 80,
  getItemKey: index => `${props.articles[index].bookId}:${props.articles[index].number}`,
})));

function measureRow(element: Element | ComponentPublicInstance | null) {
  if (!element || (element instanceof HTMLElement && element.isConnected))
    virtualizer.value.measureElement(element as HTMLElement | null);
}
</script>

<template>
  <article ref="list">
    <div
      class="tw:relative tw:w-full"
      :style="{ height: `${virtualizer.getTotalSize()}px` }"
    >
      <div
        v-for="row in virtualizer.getVirtualItems()"
        :key="String(row.key)"
        :ref="measureRow"
        :data-index="row.index"
        class="tw:absolute tw:top-0 tw:left-0 tw:w-full"
        :style="{ transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)` }"
      >
        <ArticleListItem
          :article="articles[row.index]"
          :show-book="showBook"
        />
        <hr
          v-if="row.index !== articles.length - 1"
          class="tw:m-0!"
        >
      </div>
    </div>
  </article>
</template>
