import { bookModel } from '..';

export function useBook(bookId: number) {
  const book = bookModel.books.find(book => book.id === bookId);

  if (!book)
    throw new Error(`Book with code ${bookId} not found`);

  function searchArticles() {

  }

  return {
    book,
    searchArticles,
  };
}
