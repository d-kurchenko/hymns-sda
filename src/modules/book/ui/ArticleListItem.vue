<script setup lang="ts">
import type { Article } from '../model';
import { routerModel } from 'src/modules/router';
import { useRoute } from 'vue-router';
import FavoriteArticleButton from './FavoriteArticleButton.vue';

defineProps<{ article: Article, showBook?: boolean, truncate?: boolean }>();
const route = useRoute();
</script>

<template>
  <div class="row tw:grid! tw:grid-cols-1 tw:items-center tw:min-h-14">
    <RouterLink
      class="row ripple tw:col-start-1 tw:row-start-1 tw:flex-col! tw:items-start! tw:justify-center! tw:self-stretch tw:gap-1! tw:min-w-0 tw:py-2 tw:pr-14 tw:leading-normal tw:break-words"
      :to="{
        name: routerModel.RouteName.Article,
        params: { bookId: article.bookId, articleNumber: article.number },
        state: { navigationTab: route.name === routerModel.RouteName.Favorites ? routerModel.RouteName.Favorites : routerModel.RouteName.Main },
      }"
    >
      <span
        :class="{ 'tw:line-clamp-2': truncate }"
        :title="article.title"
      >{{ article.number }}. {{ article.title }}</span>
      <span
        v-if="showBook"
        class="tw:text-xs tw:text-(--on-surface-variant) tw:max-w-full"
        :class="{ 'tw:truncate': truncate }"
      >
        {{ article.bookTitle }}
      </span>
    </RouterLink>
    <FavoriteArticleButton
      :article="article"
      class="tw:m-0! tw:col-start-1 tw:row-start-1 tw:justify-self-end tw:z-1"
    />
  </div>
</template>
