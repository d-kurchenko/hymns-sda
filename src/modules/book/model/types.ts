import type { FAVORITE_SORT, FAVORITE_VIEW } from './constants';

export interface Book {
  title: string
  articles: Article[]
  id: number
}

export interface Article {
  title: string
  number: number
  content: string
  bookTitle: string
  bookId: number
  plainContent: string
}

export interface Favorite {
  bookId: number
  articleNumber: number
  addedAt: number
}

export type FavoriteView = typeof FAVORITE_VIEW[keyof typeof FAVORITE_VIEW];
export type FavoriteSort = typeof FAVORITE_SORT[keyof typeof FAVORITE_SORT];
