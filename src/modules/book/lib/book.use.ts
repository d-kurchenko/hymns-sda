import { books } from '../model';

export function useBook(bookId: number) {
  const book = books.find(book => book.id === bookId);

  if (!book)
    throw new Error(`Book with code ${bookId} not found`);

  return {
    book,
  };
}
