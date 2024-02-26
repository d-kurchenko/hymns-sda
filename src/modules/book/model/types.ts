export type BookCode = 'gn' | 'ps' | 'pn' | 'psi' | 'rh' | 'bb';

export type Book = {
  code: BookCode;
  name: string;
  articles: string[];
};
