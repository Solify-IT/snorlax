import CommonType from './common';

export type LocalBook = CommonType & {
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

export const BOOK_TABLE_NAME = 'local_books';
