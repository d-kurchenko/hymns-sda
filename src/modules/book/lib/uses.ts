import { bookModel } from '..';

export function useBook(bookCode: bookModel.BookCode) {
  const book = bookModel.books.find(book => book.code === bookCode);

  if (!book)
    throw new Error(`Book with code ${bookCode} not found`);

  const getArticle = async (articleId: number) => {
    const article = await (await fetch(`/articles/${book.code}${articleId}.txt`)).text();

    if (!article)
      throw new Error(`Article with id ${articleId} not found`);

    return article;
  };

  return {
    book,
    getArticle,
  };
}
