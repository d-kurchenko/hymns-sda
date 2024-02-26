export type BookCode = 'gn' | 'ps' | 'pn' | 'psi' | 'rh' | 'bb';

export interface Book {
  code: BookCode
  name: string
  articles: string[]
}
