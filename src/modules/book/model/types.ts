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
