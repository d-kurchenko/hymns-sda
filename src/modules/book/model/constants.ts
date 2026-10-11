export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 40;

export const BOOK_LANGUAGE = {
  UK: 'uk',
  RU: 'ru',
} as const;

export const BOOK_LANGUAGES = Object.values(BOOK_LANGUAGE);

export const BOOK_LANGUAGE_OPTIONS = [
  { value: BOOK_LANGUAGE.UK, label: 'settings.language.uk' },
  { value: BOOK_LANGUAGE.RU, label: 'settings.language.ru' },
] as const;

export const FAVORITE_VIEW = {
  LIST: 'list',
  BOOKS: 'books',
} as const;

export const FAVORITE_SORT = {
  ADDED_AT: 'addedAt',
  NUMBER: 'number',
} as const;

export const FAVORITE_VIEW_OPTIONS = [
  { value: FAVORITE_VIEW.LIST, label: 'favorites.view.list' },
  { value: FAVORITE_VIEW.BOOKS, label: 'favorites.view.books' },
] as const;

export const FAVORITE_SORT_OPTIONS = [
  { value: FAVORITE_SORT.NUMBER, label: 'favorites.sort.number' },
  { value: FAVORITE_SORT.ADDED_AT, label: 'favorites.sort.addedAt' },
] as const;
