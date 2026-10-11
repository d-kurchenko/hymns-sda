import type { Article, Favorite, FavoriteSort, FavoriteView } from '../model';
import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { localStorageModel } from 'src/modules/local-storage';
import { computed } from 'vue';
import { books, FAVORITE_SORT, FAVORITE_VIEW } from '../model';

export const useFavorites = createSharedComposable(() => {
  const storedFavorites = useLocalStorage<Favorite[]>('article:favorites', []);
  const view = useLocalStorage<FavoriteView>(localStorageModel.LocalStorageKey.FAVORITES_VIEW, FAVORITE_VIEW.LIST);
  const sort = useLocalStorage<FavoriteSort>(localStorageModel.LocalStorageKey.FAVORITES_SORT, FAVORITE_SORT.ADDED_AT);

  const favorites = computed(() => storedFavorites.value.flatMap((favorite) => {
    const article = books.find(book => book.id === favorite.bookId)
      ?.articles
      .find(article => article.number === favorite.articleNumber);

    return article ? [{ ...article, addedAt: favorite.addedAt }] : [];
  }).sort((a, b) => sort.value === FAVORITE_SORT.NUMBER
    ? a.number - b.number || a.bookId - b.bookId
    : b.addedAt - a.addedAt));

  function isFavorite(article: Article) {
    return storedFavorites.value.some(favorite =>
      favorite.bookId === article.bookId && favorite.articleNumber === article.number,
    );
  }

  function toggleFavorite(article: Article) {
    if (isFavorite(article)) {
      storedFavorites.value = storedFavorites.value.filter(favorite =>
        favorite.bookId !== article.bookId || favorite.articleNumber !== article.number,
      );
    }
    else {
      storedFavorites.value = [...storedFavorites.value, {
        bookId: article.bookId,
        articleNumber: article.number,
        addedAt: Date.now(),
      }];
    }
  }

  return { favorites, view, sort, isFavorite, toggleFavorite };
});
