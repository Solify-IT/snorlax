export type LocalBook = {
  id: string,
  isbn: string,
  price: number,
  generos?: string[],
};

export type ExternalBook = {
  authors: string[],
  title: string,
  isbn?: string,
};

export type Book = LocalBook & ExternalBook;
