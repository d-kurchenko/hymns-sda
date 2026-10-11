import type { Article, Favorite, FavoriteSort, FavoriteView } from '../model';
import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { books } from '../model';

export const useFavorites = createSharedComposable(() => {
  const storedFavorites = useLocalStorage<Favorite[]>('article:favorites', []);
  const view = useLocalStorage<FavoriteView>('favorites:view', 'list');
  const sort = useLocalStorage<FavoriteSort>('favorites:sort', 'addedAt');

  const favorites = computed(() => storedFavorites.value.flatMap((favorite) => {
    const article = books.find(book => book.id === favorite.bookId)
      ?.articles
      .find(article => article.number === favorite.articleNumber);

    return article ? [{ ...article, addedAt: favorite.addedAt }] : [];
  }).sort((a, b) => sort.value === 'number'
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
