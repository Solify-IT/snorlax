import CommonType from './common';
import Catalogue from './catalogue';

export type LocalBook = CommonType & {
  isbn: string,
  price: number,
  libraryId: string
  amount: number;
};

export type LocalBookInput = Omit<LocalBook, 'library'>;

export type ExternalBook = {
  authors: string[],
  title: string,
  isbn?: string,
};

export type Book = LocalBook & Catalogue;

export const BOOK_TABLE_NAME = 'local_books';
